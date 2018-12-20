// @flow
import SQL from "sql-template-strings";
import { default as sqlite, type Database } from "sqlite";
import { WritableStreamBuffer } from "stream-buffers";
import intoStream from "into-stream";

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
  requestId: Promise<number>;

  constructor(archive: Archive, request: Request) {
    this.archive = archive;
    this.requestId = new Promise(resolve => {
      const recordRequest = body =>
        this.archive
          .insertRequest({
            url: request.url,
            method: request.method,
            headers: request.headers,
            body,
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
  }

  finalize(response: Response): Promise<void> {
    return this.requestId.then(requestId => {
      const bodyStream = new WritableStreamBuffer();
      // Tee off the data stream so we can log it and download it.
      const streams = teeStream(response.data);
      response.data = streams[0];
      streams[1].pipe(bodyStream);

      streams[1].once("end", () => {
        this.archive.insertResponse({
          requestId,
          statusCode: response.statusCode,
          headers: response.headers,
          body: bodyStream.getContents() || null,
        });
      });
    });
  }

  abort(): Promise<void> {
    return this.requestId.then(requestId => {
      this.archive.deleteRequest(requestId);
    });
  }
}

class ArchiveRecordingSession implements IRecordingSession {
  archive: Archive;

  constructor(archive: Archive) {
    this.archive = archive;
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
      new ArchiveRequestRecording(this.archive, recordRequest),
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
        if (!response) throw new Error("Not found");
        const { statusCode, responseHeaders, responseBody } = response;
        if (statusCode == null || !responseHeaders) {
          throw new Error("Not found");
        }
        return {
          statusCode,
          headers: responseHeaders,
          data: intoStream(responseBody || []),
        };
      });
  }
}
