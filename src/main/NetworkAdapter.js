// @flow
import * as http from "http";
import * as https from "https";
import * as fs from "fs";
import { parse as parseUrl } from "url";
import intoStream from "into-stream";

import {
  ERR_FAILED,
  ERR_CONNECTION_REFUSED,
  ERR_NAME_NOT_RESOLVED,
  ERR_CERT_COMMON_NAME_INVALID,
  ERR_CERT_AUTHORITY_INVALID,
} from "../common/errors";

const protocols = ["http", "https"];

const errorPage = (code: number, extra?: string) => `
<html>
<head>
<title>Error</title>
</head>
<body>
Failed. ${code}
${extra ? "<pre>" + extra + "</pre>" : ""}
</body>
</html>`;

export default class NetworkAdapter {
  protocol: any;
  mode: "passthrough" | "record" | "replay";

  constructor(protocol: any) {
    this.protocol = protocol;
    protocols.forEach(scheme =>
      this.protocol.interceptStreamProtocol(scheme, this.handleStreamProtocol),
    );
    this.mode = "passthrough";
  }

  setOnline() {
    this.mode = "passthrough";
  }

  setRecording() {
    this.mode = "record";
  }

  handleStreamProtocol = (request: any, callback: any => void) => {
    new Promise(resolve => {
      const renderError = (code: number, extra?: string) => {
        resolve({
          statusCode: code,
          headers: {
            "Content-Type": "text/html",
          },
          data: intoStream(errorPage(code, extra)),
        });
      };
      this.sendRequest(request, res => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: res,
        });
      }).then(req => {
        req.on("error", e => {
          switch (e.code) {
            case "ECONNREFUSED":
              renderError(ERR_CONNECTION_REFUSED);
            case "ENOTFOUND":
              renderError(ERR_NAME_NOT_RESOLVED);
            case "ERR_TLS_CERT_ALTNAME_INVALID":
              renderError(ERR_CERT_COMMON_NAME_INVALID);
            case "DEPTH_ZERO_SELF_SIGNED_CERT":
              renderError(ERR_CERT_AUTHORITY_INVALID);
            default:
              renderError(ERR_FAILED, e.toString());
          }
        });
      });
    }).then(callback);
  };

  sendRequest(
    request: any,
    callback: any => void,
  ): Promise<http.ClientRequest> {
    return Promise.all(
      (request.uploadData || []).map(chunk => {
        if (chunk.file) {
          return new Promise((resolve, reject) => {
            fs.stat(chunk.file, (err, stats) => {
              if (err) reject(err);
              else resolve({ ...chunk, size: stats.size });
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
      const scheme = request.url.indexOf("https://") === 0 ? https : http;
      const url = parseUrl(request.url);
      let headers = request.headers;
      if (contentLength > 0) {
        headers = { ...headers, "Content-Length": contentLength };
      }
      const req: http.ClientRequest = (scheme.request(
        { ...url, headers, method: request.method },
        callback,
      ): any);

      if (request.uploadData) {
        const chunks = request.uploadData.map(chunk => next => {
          if (chunk.bytes) {
            req.write(chunk.bytes);
            next();
          } else if (chunk.file) {
            const stream = fs.createReadStream(chunk.file);
            stream.pipe(req, { end: false });
            stream.on("end", next);
          } else {
            throw new Error("not implemented");
          }
        });
        chunks.push(() => req.end());
        const next = () => {
          const thunk = chunks.shift();
          thunk(next);
        };
        next();
      } else {
        req.end();
      }

      return req;
    });
  }
}
