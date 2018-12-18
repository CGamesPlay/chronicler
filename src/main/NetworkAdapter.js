// @flow
import * as http from "http";
import * as https from "https";
import intoStream from "into-stream";
import { parse as parseUrl } from "url";

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
      const scheme = request.url.indexOf("https://") === 0 ? https : http;
      const url = parseUrl(request.url);
      const req = scheme.request(
        {
          ...url,
          headers: request.headers,
          method: request.method,
        },
        res => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: res,
          });
        },
      );
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

      //req.write(postData);
      req.end();
    }).then(callback);
  };
}
