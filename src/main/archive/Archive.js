// @flow
import knex, { type Knex } from "knex";
import { Model } from "objection";

import { MigrationManager } from "./migrations";

type Replay = {
  url: string,
  method: string,
  requestHeaders: { [string]: string },
  requestBody: ?Buffer,
  statusCode: number,
  responseHeaders: { [string]: string },
  responseBody: ?Buffer,
};

class Request extends Model {
  static tableName = "requests";

  static get relationMappings() {
    return {
      response: {
        relation: Model.HasOneRelation,
        modelClass: Response,
        join: {
          from: "requests.id",
          to: "responses.requestId",
        },
      },
    };
  }

  static jsonSchema = {
    type: "object",
    properties: {
      headers: { type: "object" },
    },
  };
}

class Response extends Model {
  static tableName = "responses";

  static jsonSchema = {
    type: "object",
    properties: {
      headers: { type: "object" },
    },
  };
}

class Page extends Model {
  static tableName = "pages";
}

export default class Archive {
  static create(filename: string): Promise<Archive> {
    return Promise.resolve(null)
      .then(() =>
        knex({
          client: "sqlite3",
          useNullAsDefault: true,
          connection: { filename },
        }),
      )
      .then(db => MigrationManager.forDatabase(db))
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
  db: Knex;

  constructor(filename: string, db: Knex) {
    this.filename = filename;
    this.db = db;
  }

  insertRequest(request: $Shape<Request>): Promise<number> {
    return Request.query(this.db)
      .insert(request)
      .then(r => r.id);
  }

  deleteRequest(id: number): Promise<mixed> {
    return Request.query(this.db)
      .delete()
      .where({ id });
  }

  insertResponse(response: $Shape<Response>): Promise<number> {
    return Response.query(this.db)
      .insert(response)
      .then(r => r.id);
  }

  upsertPage(page: $Shape<Page>): Promise<number> {
    return Page.query(this.db)
      .where({ url: page.url })
      .first()
      .then(p => {
        if (p)
          return p
            .$query(this.db)
            .patch(page)
            .then(() => p.id);
        else
          return Page.query(this.db)
            .insert(page)
            .then(p => p.id);
      });
  }

  setPageTitle(id: number, title: string): Promise<mixed> {
    return Page.query(this.db)
      .findById(id)
      .then(p => p.$query(this.db).patch({ title }));
  }

  getPages(): Promise<Page> {
    return Page.query(this.db).orderBy("id", "desc");
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
    return Request.query(this.db)
      .findOne({ url, method })
      .orderBy("id", "desc")
      .joinEager("response")
      .modifyEager("response", b => {
        b.whereNot({ statusCode: 304 });
      })
      .then(request => {
        if (!request) return null;
        return {
          url: request.url,
          method: request.method,
          requestHeaders: request.headers,
          requestBody: request.body,
          statusCode: request.response.statusCode,
          responseHeaders: request.response.headers,
          responseBody: request.response.body,
        };
      });
  }

  // If a replay request comes in for a page that was never visited, but was
  // from an in-page navigation, respond with the original page's HTML data.
  // This method isn't aware of the type of request, however, so this could
  // theoretically lead to problems if the URL doesn't refer to a resource that
  // uses the HTML History API (e.g. an image or JavaScript file).
  findSubstitutePage(url: string): Promise<?string> {
    return Page.query(this.db)
      .findOne({ url })
      .columns("originalUrl")
      .then(r => (r ? r.originalUrl : null));
  }
}
