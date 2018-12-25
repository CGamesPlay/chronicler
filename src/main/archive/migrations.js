// @flow
import type { Knex } from "knex";

const initialMigration = (db: Knex) => {
  return Promise.all([
    db.schema.createTable("collections", table => {
      table
        .integer("id")
        .primary()
        .notNullable();
      table.text("name").notNullable();
      table.text("notes");
      table.timestamp("createdAt").notNullable();
      table.timestamp("updatedAt").notNullable();
    }),
    db.schema.createTable("pages", table => {
      table
        .integer("id")
        .primary()
        .notNullable();
      table
        .integer("collectionId")
        .notNullable()
        .references("collections.id");
      table.text("url").notNullable();
      table.text("originalUrl");
      table.text("title").notNullable();
      table.timestamp("createdAt").notNullable();
      table.timestamp("updatedAt").notNullable();
      table.unique("url");
    }),
    db.schema.createTable("recordings", table => {
      table
        .integer("id")
        .primary()
        .notNullable();
      table
        .integer("collectionId")
        .notNullable()
        .references("collections.id");
      table.text("url").notNullable();
      table.text("method").notNullable();
      table.text("requestHeaders").notNullable();
      table.binary("requestBody");
      table.integer("statusCode");
      table.text("responseHeaders");
      table.binary("responseBody");
      table.timestamp("createdAt").notNullable();
      table.timestamp("updatedAt").notNullable();
      table.index(["url", "method"]);
    }),
    db.schema.raw(`CREATE VIRTUAL TABLE pages_ft USING fts5 ( text )`),
  ]);
};

type Migration = {
  id: number,
  name: string,
  migration: Knex => Promise<mixed>,
};
const knownMigrations: Array<Migration> = [
  { id: 1, name: "initial", migration: initialMigration },
];

export class MigrationManager {
  static forDatabase(db: Knex): Promise<MigrationManager> {
    return db.schema
      .hasTable("migrations")
      .then(exists => {
        if (exists) {
          return db
            .select("id", "name")
            .from("migrations")
            .then(migrations => {
              let compatible = true;
              let i = 0;
              while (i < knownMigrations.length && i < migrations.length) {
                if (
                  migrations[i].id !== knownMigrations[i].id ||
                  migrations[i].name !== knownMigrations[i].name
                ) {
                  compatible = false;
                  break;
                }
                i++;
              }
              if (i !== migrations.length) {
                compatible = false;
              }
              return [compatible, i];
            });
        } else {
          return [true, 0];
        }
      })
      .then(([compatible, firstNeededMigration]) => {
        const manager = new MigrationManager(
          db,
          compatible,
          firstNeededMigration,
        );
        if (!compatible) {
          return db.raw(`PRAGMA query_only = 1`).then(() => manager);
        } else {
          return manager;
        }
      });
  }

  db: Knex;
  compatible: boolean;
  firstNeededMigration: number;

  constructor(db: Knex, compatible: boolean, firstNeededMigration: number) {
    this.db = db;
    this.compatible = compatible;
    this.firstNeededMigration = firstNeededMigration;
  }

  isCompatible(): boolean {
    return this.compatible;
  }
  needsMigrations(): boolean {
    return this.firstNeededMigration < knownMigrations.length;
  }

  migrate(): Promise<this> {
    return this.db
      .raw(`PRAGMA query_only = 0`)
      .then(() => this.db.schema.hasTable("migrations"))
      .then(hasMigrations => {
        if (hasMigrations) return;
        return this.createMigrationTable();
      })
      .then(() => {
        const nextMigration = () => {
          if (this.firstNeededMigration >= knownMigrations.length) {
            return Promise.resolve(this);
          }
          const current = knownMigrations[this.firstNeededMigration];
          this.firstNeededMigration += 1;
          return current
            .migration(this.db)
            .then(() =>
              this.db("migrations").insert({
                id: current.id,
                name: current.name,
              }),
            )
            .then(nextMigration);
        };
        return nextMigration();
      });
  }

  createMigrationTable() {
    return this.db.schema.createTable("migrations", table => {
      table
        .integer("id")
        .primary()
        .notNullable();
      table.text("name").notNullable();
    });
  }
}
