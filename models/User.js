const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./datastore/database.sqlite');

class User {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }

    static createTable() {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT,
            password TEXT
        )`);
    }

    static create(user, callback) {
        db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, 
            [user.email, user.password], 
            function (err) {
                callback(err);
            }
        );
    }

    static findByEmail(email, callback) {
        db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
            callback(err, row);
        });
    }

    static findById(id, callback) {
        db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
            callback(err, row);
        });
    }
}

User.createTable();
module.exports = User;
