// @flow
import intoStream from "into-stream";

import type {
  Request,
  Response,
  SuccessResponse,
  IProtocolHandler,
  IPersister,
} from "./types";

const RECORD = "RECORD";
const REPLAY = "REPLAY";
const PASSTHROUGH = "PASSTHROUGH";

type AdapterMode = typeof RECORD | typeof REPLAY | typeof PASSTHROUGH;

type ProtocolHandlerMap = {
  [scheme: string]: IProtocolHandler,
};

export default class NetworkAdapter {
  handlers: ProtocolHandlerMap;
  persister: IPersister;
  mode: AdapterMode;

  constructor(handlers: ProtocolHandlerMap, persister: IPersister) {
    this.handlers = handlers;
    this.persister = persister;
  }

  request(request: Request): Promise<SuccessResponse> {
    const scheme = /^(\w+):\/\//.exec(request.url);
    if (!scheme)
      return Promise.resolve(
        this.renderError(null, new Error("Malformed URL")),
      );
    const handler = this.handlers[scheme[1]];
    if (!handler)
      return Promise.resolve(
        this.renderError(null, new Error(`Unknown protocol ${scheme[1]}`)),
      );
    return handler.request(request).then(
      res => {
        if (res.data) return (res: any);
        return this.renderError(res);
      },
      err => this.renderError(null, err),
    );
  }

  renderError(response: ?Response, error: ?Error): SuccessResponse {
    return {
      data: {
        statusCode: 200,
        headers: {
          "Content-Type": "text/html",
        },
        data: intoStream(
          `<html><body>Failed.<pre>${JSON.stringify(response)}\n${
            error ? error.toString() : null
          }</pre></body></html>`,
        ),
      },
    };
  }
}
