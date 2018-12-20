// @flow
import type {
  Request,
  Response,
  IRequestRecording,
  IRecordingSession,
  IPersister,
} from "./types";
import { teeStream } from "./utils";

class NullRequestRecording implements IRequestRecording {
  constructor(request: Request) {
    console.log(`${request.method} ${request.url}`);
    Object.keys(request.headers).forEach(key => {
      console.log(`${key}: ${request.headers[key]}`);
    });
    console.log("");
    if (request.uploadData) {
      request.uploadData.pipe(process.stdout);
    }
  }

  finalize(response: Response): Promise<void> {
    console.log(response.statusCode);
    Object.keys(response.headers).forEach(key => {
      console.log(`${key}: ${response.headers[key]}`);
    });
    // Tee off the data stream so we can log it and download it.
    const streams = teeStream(response.data);
    response.data = streams[0];
    streams[1].pipe(process.stdout);
    return Promise.resolve(undefined);
  }

  abort(): Promise<void> {
    console.log("Request failed");
    return Promise.resolve(undefined);
  }
}

class NullRecordingSession implements IRecordingSession {
  constructor() {
    console.log("Begin recording session");
  }

  recordRequest(request: Request): Promise<NullPersister.RequestRecording> {
    let recordRequest = request;
    if (request.uploadData) {
      // If there's upload data, tee off the original stream so we can record
      // the response and upload it.
      const streams = teeStream(request.uploadData);
      request.uploadData = streams[0];
      recordRequest = { ...request, uploadData: streams[1] };
    }
    return Promise.resolve(new NullRequestRecording(recordRequest));
  }

  finalize(): Promise<void> {
    console.log("Ending recording session");
    return Promise.resolve(undefined);
  }
}

export default class NullPersister implements IPersister {
  static RecordingSession = NullRecordingSession;
  static RequestRecording = NullRequestRecording;

  createRecordingSession(): Promise<NullPersister.RecordingSession> {
    return Promise.resolve(new NullRecordingSession());
  }

  replayRequest(): Promise<Response> {
    return Promise.reject(new Error("Not implemented"));
  }
}
