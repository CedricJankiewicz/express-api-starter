// config/database.js (productItem-service)
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbFile = process.env.DB_FILE || path.join(__dirname, '..', 'ingredients.sqlite');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Could not connect to sqlite', err);
        process.exit(1);
    }
    console.log('Connected to sqlite database:', dbFile);
});

db.run('PRAGMA foreign_keys = ON;');

const initSql = `
CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
`;

db.serialize(() => {
    db.exec(initSql, (err) => {
        if (err) {
            console.error('Failed to initialize database', err);
            process.exit(1);
        }
        console.log('Tables ensured.');
    });

    db.get('SELECT COUNT(*) AS count FROM ingredients', (err, row) => {
        if (err) {
            console.error('Error checking item count', err);
            return;
        }

        if (row.count === 0) {
            console.log('Seeding ingredients...');

            const seedData = [
                ['Tomate', 1.50],
                ['Mozzarella', 2.50],
                ['Basilic', 0.80],
                ['Jambon', 2.00],
                ['Champignons', 1.50],
                ['Olives', 1.20],
                ['Oignons', 1.00],
                ['Poivrons', 1.30]
            ];

            const insertSql = `INSERT INTO ingredients (name, price) VALUES (?, ?)`;
            const stmt = db.prepare(insertSql);

            seedData.forEach(([name, price]) => stmt.run(name, price));
            stmt.finalize(() => console.log('Seeded ingredients.'));
        }
    });
});

module.exports = db;
