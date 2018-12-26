// @flow
import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import { WritableStreamBuffer } from "stream-buffers";

const isDevelopment = process.env.NODE_ENV !== "production";

const getErrorPage = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (isDevelopment) {
      const port = process.env.ELECTRON_WEBPACK_WDS_PORT || "9800";
      const req = http.request(`http://localhost:${port}/index.html`, res => {
        const data = new WritableStreamBuffer();
        res.pipe(data);
        res.once("end", () => resolve(data.getContents().toString("utf-8")));
      });
      req.on("error", reject);
      req.end();
    } else {
      fs.readFile(path.join(__dirname, "index.html"), "utf-8", (err, data) => {
        if (err) return reject(err);
        else resolve(data);
      });
    }
  });
};

export default getErrorPage;
