// @flow
import * as http from "http";
import * as https from "https";
import { parse as parseUrl } from "url";
import intoStream from "into-stream";

import type { Request, Response, IProtocolHandler } from "./types";

const makeHttpHandler = <Scheme: typeof http | typeof https>(scheme: Scheme) =>
  class HttpProtocolHandler implements IProtocolHandler {
    request(request: Request): Promise<Response> {
      return new Promise(resolve => {
        const url = parseUrl(request.url);
        const req = scheme.request(
          { ...url, headers: request.headers, method: request.method },
          res => {
            resolve({
              data: {
                statusCode: parseInt(res.statusCode, 10),
                headers: res.headers,
                data: res,
              },
            });
          },
        );

        req.on("error", err => {
          resolve({
            error: {
              code: err.code,
              debug: err.toString(),
            },
          });
        });

        if (request.uploadData) {
          request.uploadData.pipe(req);
        } else {
          req.end();
        }
      });
    }
  };

export const HttpProtocolHandler = makeHttpHandler(http);
export const HttpsProtocolHandler = makeHttpHandler(https);
