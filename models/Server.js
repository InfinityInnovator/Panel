const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./datastore/database.sqlite');

class Server {
    constructor(userId, name, status) {
        this.userId = userId;
        this.name = name;
        this.status = status;
    }

    static createTable() {
        db.run(`CREATE TABLE IF NOT EXISTS servers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            name TEXT,
            status TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(userId) REFERENCES users(id)
        )`);
    }

    static create(server, callback) {
        db.run(`INSERT INTO servers (userId, name, status) VALUES (?, ?, ?)`,
            [server.userId, server.name, server.status],
            function(err) {
                callback(err, this.lastID);
            });
    }

    static findAllByUser(userId, callback) {
        db.all(`SELECT * FROM servers WHERE userId = ?`, [userId], (err, rows) => {
            callback(err, rows);
        });
    }
}

module.exports = Server;
