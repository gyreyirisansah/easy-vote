/*
    We adapted some codes form dead-drop db implementation.
*/


import sqlite3 from "sqlite3";
import { existsSync } from "fs";
import { exit } from "process";
import { Database, open } from "sqlite";

const schema: string = `
CREATE TABLE Accounts (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    username TINYTEXT NOT NULL,
    hash TEXT NOT NULL
);

CREATE TABLE Users (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    acc_id INTEGER NOT NULL REFERENCES Accounts(id),
    firstname TINYTEXT NOT NULL,
    lastname TINYTEXT NOT NULL,
    email_address TEXT NOT NULL,
    phone_no
    address TEXT NOT NULL,
);

CREATE TABLE Polls (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    status INTEGER NOT NULL
);

CREATE TABLE Votes (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    poll_id INTEGER NOT NULL REFERENCES Polls(id),
    user TEXT NOT NULL,
    vote INTEGER NOT NULL REFERENCES Options(id),
    mac TEXT NOT NULL
);
CREATE TABLE Options (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    poll_id INTEGER NOT NULL REFERENCES Polls(id),
    option_name TEXT NOT NULL,
    option_image_url: TEXT NOT NULL 
);



CREATE TRIGGER forbid_votes_update BEFORE UPDATE ON Votes
BEGIN
SELECT CASE 
WHEN (OLD.id <> NEW.id  OR OLD.poll_id. <> NEW.poll_id OR OLD.user <> NEW.user  OR OLD.vote. <> NEW.vote OR OLD.mac. <> NEW.mac )
    THEN raise(abort,"MAC cannot be modified")
END;
END;
`

export const connect = async (): Promise<Database<sqlite3.Database, sqlite3.Statement>> => {
    try {
        let mustInitDb = false;
        if (!existsSync("dd.db")) {
            mustInitDb = true;
        }

        return await open({
            filename: "dd.db",
            driver: sqlite3.Database,
        }).then(async (db) => {
            if (mustInitDb) {
                await db.exec(schema);
            }
            return db
        }).then(async (db) => await db);

    } catch (error) {
        console.error(error)
        exit();
    }
}
