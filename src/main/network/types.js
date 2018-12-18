// @flow
import type { Readable } from "stream";

export type Request = {
  url: string,
  method: string,
  headers: { [string]: string },
  uploadData?: ?Readable,
};

// Indicates that the implementation reached the remote server and received a
// response, even if that response was some sort of failure (e.g. 404). This
// will be saved into the archive and replayed in the future.
export type SuccessResponse = {
  data: {
    statusCode: number,
    headers: { [string]: string },
    data: Readable,
  },
};

// Indicates that the implementation could not reach the remote server. This
// will not be saved into the archive.
export type FailureResponse = {
  error: {
    code: number,
    debug?: string,
  },
};

export type Response = SuccessResponse | FailureResponse;

// Responsible for taking a request for a URL, processing it, and returning the
// result. This should be where http, https, ipfs, dat, etc are all implemented.
export interface IProtocolHandler {
  // Process a request, and return a response when available.
  request(Request): Promise<Response>;
}

// Represents a single HTTP request for a persister.
export interface IRequestRecording {
  // Record the response
  finalize(SuccessResponse): Promise<void>;
  // Abort the recording. In this case, nothing should be recorded at all.
  abort(): Promise<void>;
}

// Represents a single recording session for a persister. Recording sessions are
// used to enable snapshots at a given time, for example to track changes of a
// site.
export interface IRecordingSession {
  // Begin recording the given request.
  recordRequest(Request): Promise<IRequestRecording>;
  // Finalize the session. No more requests will be recorded after this point.
  finalize(): Promise<void>;
}

// Responsible for storing requests and responses and later replaying them.
export interface IPersister {
  // Indicate that a new recording session has begun. This will always be called
  // before any requests are recorded.
  createRecordingSession(): Promise<IRecordingSession>;
  // Replay a request.
  replayRequest(Request): Promise<Response>;
}
