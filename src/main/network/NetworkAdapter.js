// @flow
import type {
  Request,
  Response,
  IProtocolHandler,
  IRecordingSession,
  IPersister,
} from "./types";

const RECORD = "RECORD";
const REPLAY = "REPLAY";
const PASSTHROUGH = "PASSTHROUGH";

opaque type AdapterMode = typeof RECORD | typeof REPLAY | typeof PASSTHROUGH;

type ProtocolHandlerMap = {
  [scheme: string]: IProtocolHandler,
};

export default class NetworkAdapter {
  handlers: ProtocolHandlerMap;
  persister: IPersister;
  session: ?IRecordingSession;
  mode: AdapterMode;
  ready: Promise<mixed>;

  constructor(handlers: ProtocolHandlerMap, persister: IPersister) {
    this.handlers = handlers;
    this.persister = persister;
    this.mode = REPLAY;
    this.ready = Promise.resolve(undefined);
  }

  isRecording(): boolean {
    return this.mode === RECORD;
  }
  isReplaying(): boolean {
    return this.mode === REPLAY;
  }

  startRecordingSession(): Promise<void> {
    return (this.ready = this.ready.then(() => {
      if (this.mode === RECORD) {
        throw new Error("Recording session already in progress");
      }
      return this.persister.createRecordingSession().then(session => {
        this.mode = RECORD;
        this.session = session;
      });
    }));
  }

  finishRecordingSession(): Promise<void> {
    return (this.ready = this.ready.then(() => {
      if (this.mode !== RECORD) {
        throw new Error("No recording session in progress");
      }
      const session = this.session;
      if (!session) return;
      this.session = null;
      return session.finalize().then(() => {
        this.mode = REPLAY;
      });
    }));
  }

  // Finalize a recording session if one exists and enter passthrough mode.
  setPassthroughMode(): Promise<void> {
    return (this.ready = this.ready.then(() => {
      if (this.mode === RECORD) {
        throw new Error("Call finishRecordingSession to end recording.");
      }
      this.mode = PASSTHROUGH;
    }));
  }

  setReplayMode(): Promise<void> {
    return (this.ready = this.ready.then(() => {
      if (this.mode === RECORD) {
        throw new Error("Call finishRecordingSession to end recording.");
      }
      this.mode = REPLAY;
    }));
  }

  request(request: Request): Promise<Response> {
    const scheme = /^(\w+):\/\//.exec(request.url);
    if (!scheme) return Promise.reject(new Error("Malformed URL"));
    const handler = this.handlers[scheme[1]];
    if (!handler)
      return Promise.reject(new Error(`Unknown protocol ${scheme[1]}`));
    return this.ready.then(() => {
      if (this.mode === RECORD) {
        const session = this.session;
        if (!session) throw new Error("No session while in record mode");
        return session
          .recordRequest(request)
          .then(recording =>
            handler
              .request(request)
              .then(
                response => recording.finalize(response).then(() => response),
                error => recording.abort().then(() => Promise.reject(error)),
              ),
          );
      } else if (this.mode === PASSTHROUGH) {
        return handler.request(request);
      } else {
        return this.persister.replayRequest(request);
      }
    });
  }
}
