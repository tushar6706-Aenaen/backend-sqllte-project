import { DatabaseSync } from "node::sqlite";
const db = new DatabaseSync(':memory:');

//execute some queries or strings

db.exec(`
    CREATE TABLE user(
        id INTEGER,
        username text unique,
        password text

    )
    `)