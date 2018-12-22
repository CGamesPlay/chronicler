// @flow
import { WritableStreamBuffer } from "stream-buffers";
import intoStream from "into-stream";

import { ERR_NETWORK_IO_SUSPENDED } from "common/errors";
import type { Archive } from "../archive";
import type {
  Request,
  Response,
  IRequestRecording,
  IRecordingSession,
  IPersister,
} from "./types";
import { teeStream } from "./utils";

class ArchiveRequestRecording implements IRequestRecording {
  archive: Archive;
  session: ArchiveRecordingSession;
  recordingId: Promise<number>;

  constructor(
    archive: Archive,
    session: ArchiveRecordingSession,
    request: Request,
  ) {
    this.archive = archive;
    this.session = session;
    this.recordingId = new Promise(resolve => {
      this.session.collectionId.then(collectionId => {
        const recordRequest = body =>
          this.archive
            .insertRecording({
              collectionId,
              url: request.url,
              method: request.method,
              requestHeaders: request.headers,
              requestBody: body,
            })
            .then(resolve);
        if (request.uploadData) {
          const readable = request.uploadData;
          const bodyStream = new WritableStreamBuffer();
          readable.pipe(bodyStream);
          readable.once("end", () => recordRequest(bodyStream.getContents()));
        } else {
          recordRequest(null);
        }
      });
    });
  }

  finalize(response: Response): Promise<void> {
    return this.recordingId.then(recordingId => {
      const bodyStream = new WritableStreamBuffer();
      // Tee off the data stream so we can log it and download it.
      const streams = teeStream(response.data);
      response.data = streams[0];
      streams[1].pipe(bodyStream);

      streams[1].once("end", () => {
        this.archive.updateRecording({
          id: recordingId,
          statusCode: response.statusCode,
          responseHeaders: response.headers,
          responseBody: bodyStream.getContents() || null,
        });
      });
    });
  }

  abort(): Promise<void> {
    return this.recordingId.then(recordingId => {
      this.archive.deleteRecording(recordingId);
    });
  }
}

class ArchiveRecordingSession implements IRecordingSession {
  archive: Archive;
  collectionId: Promise<number>;

  constructor(archive: Archive) {
    this.archive = archive;
    this.collectionId = this.archive.insertCollection({
      name: `Recording Session ${new Date().toString()}`,
    });
  }

  recordRequest(request: Request): Promise<ArchivePersister.RequestRecording> {
    let recordRequest = request;
    if (request.uploadData) {
      // If there's upload data, tee off the original stream so we can record
      // the response and upload it.
      const streams = teeStream(request.uploadData);
      request.uploadData = streams[0];
      recordRequest = { ...request, uploadData: streams[1] };
    }
    return Promise.resolve(
      new ArchiveRequestRecording(this.archive, this, recordRequest),
    );
  }

  finalize(): Promise<void> {
    return Promise.resolve(undefined);
  }
}

export default class ArchivePersister implements IPersister {
  static RecordingSession = ArchiveRecordingSession;
  static RequestRecording = ArchiveRequestRecording;

  archive: Archive;

  constructor(archive: Archive) {
    this.archive = archive;
  }

  createRecordingSession(): Promise<ArchivePersister.RecordingSession> {
    return Promise.resolve(new ArchiveRecordingSession(this.archive));
  }

  replayRequest(request: Request): Promise<Response> {
    if (request.method !== "GET") {
      return Promise.reject(new Error("Only GET requests supported"));
    } else if (request.uploadData) {
      return Promise.reject(new Error("Cannot replay requests with uploads"));
    }
    return this.archive
      .findReplay(request.url, request.method)
      .then(response => {
        if (!response) throw this.error("Not found", ERR_NETWORK_IO_SUSPENDED);
        const { statusCode, responseHeaders, responseBody } = response;
        if (statusCode == null || !responseHeaders) {
          throw this.error("Not found", ERR_NETWORK_IO_SUSPENDED);
        }
        return {
          statusCode,
          headers: responseHeaders,
          data: intoStream(responseBody || []),
        };
      });
  }

  error(message: string, code: number) {
    const error = new Error(message);
    (error: any).code = code;
    return error;
  }
}
