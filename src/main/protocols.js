// @flow
import { protocol } from "electron";
import * as path from "path";

const isDevelopment = process.env.NODE_ENV !== "production";

protocol.registerStandardSchemes(["app"], { secure: true });

export default function registerProtocols() {
  const prefix = "app://main/";
  if (isDevelopment) {
    protocol.registerHttpProtocol("app", (request, callback) => {
      const port = process.env.ELECTRON_WEBPACK_WDS_PORT || "9800";
      if (request.url.indexOf(prefix) === 0) {
        const url = `http://localhost:${port}/${request.url.substr(
          prefix.length,
        )}`;
        const redirect = { ...request, url };
        callback(redirect);
      } else {
        callback(null);
      }
    });
  } else {
    protocol.registerFileProtocol("app", (request, callback) => {
      if (request.url.indexOf(prefix) === 0) {
        const filename = path.join(
          __dirname,
          request.url.substr(prefix.length),
        );
        callback(filename);
      } else {
        callback(null);
      }
    });
  }
}
