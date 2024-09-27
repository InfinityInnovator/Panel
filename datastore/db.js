// db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./datastore/database.sqlite');

// Create tables if they do not exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT,
        password TEXT,
        apiKey TEXT
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS servers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        name TEXT,
        status TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(id)
    )`);
});

module.exports = db;