// @flow
import { protocol as electronProtocol, session } from "electron";
import * as path from "path";

import { ERR_FILE_NOT_FOUND } from "../common/errors";

const isDevelopment = process.env.NODE_ENV !== "production";

electronProtocol.registerStandardSchemes(["app"], { secure: true });

const prefix = "app://main/";
const htmlPrefix = prefix + "html/";
// Convert an app URL to one relative to the webpack root, or reject it.
const routeUrl = (url: string): ?string => {
  if (!url.startsWith(prefix)) return null;
  if (url.startsWith(htmlPrefix)) return "index.html";
  return url.substr(prefix.length);
};

export default function registerAppProtocol(protocol: typeof electronProtocol) {
  if (isDevelopment) {
    protocol.registerHttpProtocol("app", (request, callback) => {
      const url = routeUrl(request.url);
      if (!url) return callback(ERR_FILE_NOT_FOUND);
      const port = process.env.ELECTRON_WEBPACK_WDS_PORT || "9800";
      const redirectUrl = `http://localhost:${port}/${url}`;
      const redirect = {
        ...request,
        url: redirectUrl,
        // We force all app requests to use the global default session, to
        // bypass the Archive when showing internal pages.
        session: session.fromPartition(""),
      };
      callback(redirect);
    });
  } else {
    protocol.registerFileProtocol("app", (request, callback) => {
      const url = routeUrl(request.url);
      if (!url) return callback(ERR_FILE_NOT_FOUND);
      const filename = path.join(__dirname, url);
      callback(filename);
    });
  }
}
