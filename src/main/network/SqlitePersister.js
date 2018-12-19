// @flow
import SQL from "sql-template-strings";
import { default as sqlite, type Database } from "sqlite";
import { WritableStreamBuffer } from "stream-buffers";
import intoStream from "into-stream";

import type {
  Request,
  SuccessResponse,
  FailureResponse,
  Response,
  IRequestRecording,
  IRecordingSession,
  IPersister,
} from "./types";
import { teeStream } from "./utils";
import { MigrationManager } from "./sqlite/migrations";
import {
  insertRequest,
  insertResponse,
  deleteRequest,
  findReplay,
} from "./sqlite/queries";

class SqliteRequestRecording implements IRequestRecording {
  persister: SqlitePersister;
  requestId: Promise<number>;

  constructor(persister: SqlitePersister, request: Request) {
    this.persister = persister;
    this.requestId = new Promise(resolve => {
      const recordRequest = body =>
        this.persister.db
          .run(
            insertRequest(
              request.url,
              request.method,
              JSON.stringify(request.headers),
              body,
            ),
          )
          .then(({ lastID }) => resolve(lastID));
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

  finalize(response: SuccessResponse): Promise<void> {
    return this.requestId.then(requestId => {
      const bodyStream = new WritableStreamBuffer();
      // Tee off the data stream so we can log it and download it.
      const streams = teeStream(response.data.data);
      response.data.data = streams[0];
      streams[1].pipe(bodyStream);

      streams[1].once("end", () => {
        this.persister.db.run(
          insertResponse(
            requestId,
            response.data.statusCode,
            JSON.stringify(response.data.headers),
            bodyStream.getContents() || null,
          ),
        );
      });
    });
  }

  abort(): Promise<void> {
    return this.requestId.then(requestId => {
      this.persister.db.run(deleteRequest(requestId));
    });
  }
}

class SqliteRecordingSession implements IRecordingSession {
  persister: SqlitePersister;

  constructor(persister: SqlitePersister) {
    this.persister = persister;
  }

  recordRequest(request: Request): Promise<SqlitePersister.RequestRecording> {
    let recordRequest = request;
    if (request.uploadData) {
      // If there's upload data, tee off the original stream so we can record
      // the response and upload it.
      const streams = teeStream(request.uploadData);
      request.uploadData = streams[0];
      recordRequest = { ...request, uploadData: streams[1] };
    }
    return Promise.resolve(
      new SqliteRequestRecording(this.persister, recordRequest),
    );
  }

  finalize(): Promise<void> {
    return Promise.resolve(undefined);
  }
}

export default class SqlitePersister implements IPersister {
  static RecordingSession = SqliteRecordingSession;
  static RequestRecording = SqliteRequestRecording;

  static create(filename: string): Promise<SqlitePersister> {
    return sqlite
      .open(filename)
      .then(database => MigrationManager.forDatabase(database))
      .then(manager => {
        if (!manager.isCompatible()) {
          throw new Error(
            "Database is incompatible with this version of the program",
          );
        } else if (manager.needsMigrations()) {
          // XXX - ask the user before migrating
          return manager.migrate();
        } else {
          return manager;
        }
      })
      .then(manager => new SqlitePersister(filename, manager.db));
  }

  filename: string;
  db: Database;

  constructor(filename: string, db: Database) {
    this.filename = filename;
    this.db = db;
  }

  createRecordingSession(): Promise<SqlitePersister.RecordingSession> {
    return Promise.resolve(new SqliteRecordingSession(this));
  }

  replayRequest(request: Request): Promise<Response> {
    if (request.method !== "GET") {
      return Promise.resolve(this.formatError("Only GET requests supported"));
    } else if (request.uploadData) {
      return Promise.resolve(
        this.formatError("Cannot replay requests with uploads"),
      );
    }
    return this.db
      .get(findReplay(request.url, request.method))
      .then(response => {
        if (!response) return this.formatError("Not found");
        console.log(response);
        const { statusCode, responseHeaders, responseBody } = response;
        return {
          data: {
            statusCode,
            headers: JSON.parse(responseHeaders),
            data: intoStream(responseBody),
          },
        };
      });
  }

  formatError(message: string): FailureResponse {
    return { error: { code: -1, debug: message } };
  }
}
