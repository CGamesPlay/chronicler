// @flow
import knex, { type Knex } from "knex";
import { Model } from "objection";

import { MigrationManager } from "./migrations";

class Recording extends Model {
  static tableName = "recordings";

  static jsonSchema = {
    type: "object",
    properties: {
      requestHeaders: { type: "object" },
      responseHeaders: { type: "object" },
    },
  };

  id: number;
  url: string;
  method: string;
  requestHeaders: Object;
  requestBody: ?Buffer;
  statusCode: ?number;
  responseHeaders: ?Object;
  responseBody: ?Buffer;
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

  insertRecording(fields: Object): Promise<number> {
    return Recording.query(this.db)
      .insert(fields)
      .then(r => r.id);
  }

  deleteRecording(id: number): Promise<mixed> {
    return Recording.query(this.db)
      .where({ id })
      .delete();
  }

  updateRecording(fields: Object): Promise<mixed> {
    return Recording.query(this.db)
      .findById(fields.id)
      .patch(fields)
      .then(() => {});
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

  findReplay(url: string, method: string): Promise<?Recording> {
    return this.findReplayDirect(url, method).then(replay => {
      if (replay) return replay;
      if (method !== "GET") return null;
      return this.findSubstitutePage(url).then(originalUrl => {
        if (!originalUrl) return null;
        return this.findReplayDirect(originalUrl, method);
      });
    });
  }

  findReplayDirect(url: string, method: string): Promise<?Recording> {
    return Recording.query(this.db)
      .findOne({ url, method })
      .whereNot({ statusCode: 304 })
      .orderBy("id", "desc")
      .then(recording => {
        if (!recording || !recording.statusCode) return null;
        return recording;
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
