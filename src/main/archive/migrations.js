// @flow
import type { Knex } from "knex";

const initialMigration = (db: Knex) => {
  return Promise.all([
    db.schema.createTable("requests", table => {
      table
        .integer("id")
        .primary()
        .notNullable();
      table.text("url").notNullable();
      table.text("method").notNullable();
      table.text("headers").notNullable();
      table.binary("body");
      table.index(["url", "method"]);
    }),
    db.schema.createTable("responses", table => {
      table
        .integer("id")
        .primary()
        .notNullable();
      table
        .integer("requestId")
        .notNullable()
        .references("requests.id");
      table.integer("statusCode").notNullable();
      table.text("headers").notNullable();
      table.binary("body");
      table.unique("requestId");
    }),
    db.schema.createTable("pages", table => {
      table
        .integer("id")
        .primary()
        .notNullable();
      table.text("url").notNullable();
      table.text("originalUrl");
      table.text("title").notNullable();
      table.unique("url");
    }),
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
