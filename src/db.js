import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync(':memory:');

console.log('🗄️ Database initialized');

//execute some queries or strings

db.exec(`
    CREATE TABLE user(
        id INTEGER PRIMARY KEY  AUTOINCREMENT,
        username text UNIQUE,
        password text
    );
`)
console.log('✅ User table created');

db.exec(`
    CREATE TABLE todos (
    id INTEGER PRIMARY KEY  AUTOINCREMENT,
    user_id INTEGER,
    task TEXT,
    completed BOOLEAN DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES user(id)
    );
`)
console.log('✅ Todos table created');

export default db;