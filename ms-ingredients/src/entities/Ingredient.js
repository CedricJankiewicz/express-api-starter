// entities/Pizza.js
const db = require('../config/database');

class Ingredient {
    static findAll() {
        const sql = `SELECT * FROM ingredients ORDER BY id DESC`;
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static findById(id) {
        const sql = `SELECT * FROM ingredients WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row || null);
            });
        });
    }
}

module.exports = Ingredient;
