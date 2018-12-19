// @flow
import SQL from "sql-template-strings";
import type { Database } from "sqlite";

const createMigrationTable = `
CREATE TABLE IF NOT EXISTS migrations (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
)`;

const readMigrations = SQL`SELECT id, name FROM migrations ORDER BY id`;

const insertMigration = (id: number, name: string) =>
  SQL`INSERT INTO migrations (id, name) VALUES (${id}, ${name})`;

const initialMigration = `
CREATE TABLE requests (
  id INTEGER PRIMARY KEY,
  url TEXT NOT NULL,
  method TEXT NOT NULL,
  headers TEXT NOT NULL,
  body BLOB
);
CREATE INDEX requests_url_method ON requests ( url, method );
CREATE TABLE responses (
  id INTEGER PRIMARY KEY,
  requestId INTEGER NOT NULL UNIQUE,
  statusCode INTEGER NOT NULL,
  headers TEXT NOT NULL,
  body BLOB,
  FOREIGN KEY ( requestId ) REFERENCES requests ( id )
);`;

type Migration = {
  id: number,
  name: string,
  sql: string,
};
const knownMigrations: Array<Migration> = [
  { id: 1, name: "initial", sql: initialMigration },
];

export class MigrationManager {
  static forDatabase(db: Database): Promise<MigrationManager> {
    return db
      .exec(createMigrationTable)
      .then(() => db.all(readMigrations))
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
        const manager = new MigrationManager(db, compatible, i);
        if (!compatible) {
          return db.run(SQL`PRAGMA query_only = 1`).then(() => manager);
        } else {
          return manager;
        }
      });
  }

  db: Database;
  compatible: boolean;
  firstNeededMigration: number;

  constructor(db: Database, compatible: boolean, firstNeededMigration: number) {
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
    const nextMigration = () => {
      if (this.firstNeededMigration >= knownMigrations.length) {
        return Promise.resolve(this);
      }
      const current = knownMigrations[this.firstNeededMigration];
      this.firstNeededMigration += 1;
      return this.db
        .exec(current.sql)
        .then(() => this.db.run(insertMigration(current.id, current.name)))
        .then(nextMigration);
    };
    return nextMigration();
  }
}
