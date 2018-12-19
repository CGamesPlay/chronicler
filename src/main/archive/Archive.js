// @flow
import SQL from "sql-template-strings";
import { default as sqlite, type Database } from "sqlite";

import { MigrationManager } from "./migrations";

type Request = {
  url: string,
  method: string,
  headers: { [string]: string },
  body: ?Buffer,
};

type Response = {
  requestId: number,
  statusCode: number,
  headers: { [string]: string },
  body: ?Buffer,
};

type Replay = {
  url: string,
  method: string,
  requestHeaders: { [string]: string },
  requestBody: ?Buffer,
  statusCode: number,
  responseHeaders: { [string]: string },
  responseBody: ?Buffer,
};

type Page = {
  id: number,
  url: string,
  // The original URL that was used, when the actual URL is created from the
  // History API.
  originalUrl: ?string,
  title: string,
};

export default class Archive {
  static create(filename: string): Promise<Archive> {
    return sqlite
      .open(filename)
      .then(database => MigrationManager.forDatabase(database))
      .then(manager => {
        if (!manager.isCompatible()) {
          throw new Error(
            "Database is incompatible with this version of the program",
          );
        } else if (manager.needsMigrations()) {
          // XXX - ask the user before migrating
          return manager.migrate();
        } else {
          return manager;
        }
      })
      .then(manager => new Archive(filename, manager.db));
  }

  filename: string;
  db: Database;

  constructor(filename: string, db: Database) {
    this.filename = filename;
    this.db = db;
  }

  insertRequest(request: $Shape<Request>): Promise<number> {
    return this.db
      .run(
        SQL`
        INSERT INTO requests ( url, method, headers, body )
        VALUES ( ${request.url}, ${request.method}, ${JSON.stringify(
          request.headers,
        )}, ${request.body} )`,
      )
      .then(({ lastID }) => lastID);
  }

  deleteRequest(id: number): Promise<mixed> {
    return this.db.run(SQL`DELETE FROM requests WHERE id = ${id}`);
  }

  insertResponse(response: $Shape<Response>): Promise<number> {
    return this.db
      .run(
        SQL`
        INSERT INTO responses ( requestId, statusCode, headers, body )
        VALUES ( ${response.requestId}, ${
          response.statusCode
        }, ${JSON.stringify(response.headers)}, ${response.body} )`,
      )
      .then(({ lastID }) => lastID);
  }

  upsertPage(page: $Shape<Page>): Promise<number> {
    return this.db
      .run(
        SQL`
        INSERT OR REPLACE INTO pages ( url, originalUrl, title )
        VALUES ( ${page.url}, ${page.originalUrl}, ${page.title} )`,
      )
      .then(({ lastID }) => lastID);
  }

  setPageTitle(id: number, title: string): Promise<mixed> {
    return this.db.run(SQL`UPDATE pages SET title = ${title} WHERE id = ${id}`);
  }

  findReplay(url: string, method: string): Promise<?Replay> {
    return this.findReplayDirect(url, method).then(replay => {
      if (replay) return replay;
      if (method !== "GET") return null;
      return this.findSubstitutePage(url).then(originalUrl => {
        if (!originalUrl) return null;
        return this.findReplayDirect(originalUrl, method);
      });
    });
  }

  findReplayDirect(url: string, method: string): Promise<?Replay> {
    return this.db
      .get(
        SQL`
        SELECT url, method, requests.headers AS requestHeaders, requests.body AS requestBody,
        statusCode, responses.headers as responseHeaders, responses.body AS responseBody
        FROM requests
        LEFT JOIN responses
        ON responses.requestId = requests.id
        WHERE url = ${url}
        AND method = ${method}
        AND statusCode != 304
        ORDER BY requests.id DESC
        LIMIT 1`,
      )
      .then(raw => {
        if (!raw || raw.statusCode == null) return null;
        const result = { ...raw };
        result.requestHeaders = JSON.parse(raw.requestHeaders);
        if (raw.responseHeaders) {
          result.responseHeaders = JSON.parse(raw.responseHeaders);
        }
        return result;
      });
  }

  // If a replay request comes in for a page that was never visited, but was
  // from an in-page navigation, respond with the original page's HTML data.
  // This method isn't aware of the type of request, however, so this could
  // theoretically lead to problems if the URL doesn't refer to a resource that
  // uses the HTML History API (e.g. an image or JavaScript file).
  findSubstitutePage(url: string): Promise<?string> {
    return this.db
      .get(SQL`SELECT originalUrl FROM pages WHERE url = ${url}`)
      .then(res => (res ? res.originalUrl : null));
  }
}
