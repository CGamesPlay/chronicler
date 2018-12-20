// @flow
import * as http from "http";
import * as https from "https";
import { parse as parseUrl } from "url";
import intoStream from "into-stream";

import type { Request, Response, IProtocolHandler } from "./types";

const makeHttpHandler = <Scheme: typeof http | typeof https>(scheme: Scheme) =>
  class HttpProtocolHandler implements IProtocolHandler {
    request(request: Request): Promise<Response> {
      return new Promise((resolve, reject) => {
        const url = parseUrl(request.url);
        const req = scheme.request(
          { ...url, headers: request.headers, method: request.method },
          res => {
            const headers = { ...res.headers };
            // Since we are effectively forwarding this as a new HTTP response,
            // but the content has been decoded, clear out these headers.
            delete headers["connection"];
            delete headers["keep-alive"];
            delete headers["proxy-authenticate"];
            delete headers["trailer"];
            delete headers["transfer-encoding"];
            resolve({
              statusCode: parseInt(res.statusCode, 10),
              headers,
              data: res,
            });
          },
        );

        req.on("error", reject);

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
