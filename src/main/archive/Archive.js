// @flow
import knex, { type Knex } from "knex";
import { Model } from "objection";

import { MigrationManager } from "./migrations";

class AppModel extends Model {
  $beforeInsert(queryContext: Object) {
    return Promise.resolve(super.$beforeInsert(queryContext)).then(() => {
      // Set the createdAt and updatedAt if those are part of the schema.
      const schema = this.constructor.jsonSchema;
      if (schema && schema.properties) {
        if (!this.createdAt && schema.properties.createdAt) {
          this.createdAt = new Date().toISOString();
        }
        if (schema.properties.updatedAt) {
          this.updatedAt = this.createdAt || new Date().toISOString();
        }
      }
    });
  }

  $beforeUpdate(opt: Object, queryContext: Object) {
    return Promise.resolve(super.$beforeUpdate(opt, queryContext)).then(() => {
      // Set the updatedAt if those are part of the schema.
      const schema = this.constructor.jsonSchema;
      if (schema && schema.properties && schema.properties.updatedAt) {
        this.updatedAt = new Date().toISOString();
      }
    });
  }
}

class Collection extends AppModel {
  static tableName = "collections";
  static jsonSchema = {
    type: "object",
    required: ["name"],
    properties: {
      id: { type: "number" },
      name: { type: "string", minLength: 1, maxLength: 255 },
      notes: { type: ["string", "null"], maxLength: 1024 },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  };
}

class Page extends AppModel {
  static tableName = "pages";
  static jsonSchema = {
    type: "object",
    required: ["collectionId", "url", "title"],
    properties: {
      id: { type: "number" },
      collectionId: { type: "number" },
      url: { type: "string", minLength: 1, maxLength: 1024 },
      originalUrl: { type: ["string", "null"], minLength: 1, maxLength: 1024 },
      title: { type: "string", minLength: 1, maxLength: 255 },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  };
}

class Recording extends AppModel {
  static tableName = "recordings";

  static jsonSchema = {
    type: "object",
    required: ["collectionId", "url", "method", "requestHeaders"],
    properties: {
      id: { type: "number" },
      collectionId: { type: "number" },
      url: { type: "string", minLength: 1, maxLength: 1024 },
      method: { type: "string", minLength: 1, maxLength: "16" },
      requestHeaders: { type: "object" },
      statusCode: { type: ["number", "null"] },
      responseHeaders: { type: ["object", "null"] },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
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

  insertCollection(fields: Object): Promise<number> {
    return Collection.query(this.db)
      .insert(fields)
      .then(c => c.id);
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

  setPageFullText(id: number, text: string): Promise<mixed> {
    return this.db("pages_ft")
      .where({ rowid: id })
      .count("* as known")
      .first()
      .then(({ known }) => {
        if (known > 0) {
          return this.db("pages_ft")
            .where({ rowid: id })
            .update({ text });
        } else {
          return this.db("pages_ft").insert({ rowid: id, text });
        }
      });
  }

  getPages(): Promise<Page> {
    return Page.query(this.db).orderBy("id", "desc");
  }

  fullTextSearch({ query }: any): Promise<mixed> {
    const escapedQuery = query.replace(/\W/g, " ");
    return this.db("pages_ft")
      .select([
        "rowid",
        this.db.raw(
          "snippet(pages_ft, -1, '\x02', '\x03', '\t', 64) as snippet",
        ),
        this.db.raw("bm25(pages_ft) as bm25"),
      ])
      .whereRaw("text MATCH ?", escapedQuery)
      .then(matches => {
        const matchById = {};
        matches.forEach(match => (matchById[match.rowid] = match));
        return Page.query(this.db)
          .whereIn("id", matches.map(m => m.rowid))
          .then(pages =>
            pages
              .map(page => ({
                page,
                match: matchById[page.id],
              }))
              .sort((a, b) => a.match.bm25 - b.match.bm25)
              .map(({ page, match }) => ({
                pageId: page.id,
                url: page.url,
                title: page.title,
                snippet: match.snippet,
              })),
          );
      });
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
