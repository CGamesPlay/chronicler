// @flow
import * as fs from "fs";
import StreamConcat from "stream-concat";
import intoStream from "into-stream";

import { ERR_FAILED } from "../common/errors";
import type { NetworkAdapter } from "./network";
import registerAppProtocol from "./registerAppProtocol";

export default class ElectronRequestConnector {
  session: any;
  networkAdapter: NetworkAdapter;

  constructor(session: any, networkAdapter: NetworkAdapter) {
    this.session = session;
    this.networkAdapter = networkAdapter;
    Object.keys(networkAdapter.handlers).forEach(scheme =>
      this.session.protocol.interceptStreamProtocol(
        scheme,
        this.handleStreamProtocol,
      ),
    );
    registerAppProtocol(this.session.protocol);
  }

  handleStreamProtocol = (electronRequest: any, callback: any => void) => {
    this.prepareUploadData(electronRequest.uploadData)
      .then(({ contentLength, stream }) => {
        let headers = electronRequest.headers;
        if (contentLength > 0) {
          headers = { ...headers, "Content-Length": contentLength };
        }
        const request = { ...electronRequest, headers, uploadData: stream };
        return this.networkAdapter.request(request);
      })
      .then(callback)
      .catch(err =>
        callback(
          // Electron will straight-up crash if the error code is not a number
          err.code && Number.isInteger(err.code) ? err.code : ERR_FAILED,
        ),
      );
  };

  prepareUploadData(
    uploadData: ?Array<any>,
  ): Promise<{ contentLength: number, stream?: ReadableStream }> {
    if (!uploadData || uploadData.length === 0) {
      return Promise.resolve({ contentLength: 0 });
    }
    return Promise.all(
      uploadData.map(chunk => {
        if (chunk.file) {
          return new Promise((resolve, reject) => {
            fs.stat(chunk.file, (err, stats) => {
              if (err) reject(err);
              else resolve({ ...chunk, size: stats.size });
            });
          });
        } else if (chunk.blobUUID) {
          return new Promise(resolve => {
            this.session.getBlobData(chunk.blobUUID, bytes => {
              resolve({ ...chunk, bytes });
            });
          });
        } else {
          return chunk;
        }
      }),
    ).then(uploads => {
      const contentLength = uploads.reduce((acc: number, chunk: any) => {
        if (chunk.bytes) {
          return acc + chunk.bytes.length;
        } else if (chunk.file) {
          return acc + chunk.size;
        } else {
          throw new Error("not implemented");
        }
      }, 0);
      let currentIdx = -1;
      const nextStream = () => {
        currentIdx += 1;
        if (currentIdx === uploads.length) return null;
        const chunk = uploads[currentIdx];
        if (chunk.bytes) {
          return intoStream(chunk.bytes);
        } else if (chunk.file) {
          return fs.createReadStream(chunk.file);
        } else {
          throw new Error("not implemented");
        }
      };
      const stream = new StreamConcat(nextStream);
      return { contentLength, stream };
    });
  }
}
