// config/database.js (pizza-service)
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbFile = process.env.DB_FILE || path.join(__dirname, '..', 'pizzas.sqlite');

const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Could not connect to sqlite', err);
        process.exit(1);
    }
    console.log('Connected to sqlite database:', dbFile);
});

// Enable foreign key enforcement for local integrity (only within this DB)
db.run('PRAGMA foreign_keys = ON;');

// Create tables
const initSql = `
CREATE TABLE IF NOT EXISTS pizzas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    imageUrl TEXT,
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

    // Seed pizzas only if empty
    db.get('SELECT COUNT(*) AS count FROM pizzas', (err, row) => {
        if (err) {
            console.error('Error checking product count', err);
            return;
        }

        if (row.count === 0) {
            console.log('Seeding test data (products)...');

            const productData = [
                ['Margherita', 12.00],
                ['Reine', 14.00],
                ['4 Fromages', 15.00],
                ['Végétarienne', 14.50],
                ['Jambon Champignons', 14.00]
            ];

            const insertProductSql = `INSERT INTO pizzas (name, price)
                                VALUES (?, ?)`;
            const productStmt = db.prepare(insertProductSql);

            productData.forEach(([name, price]) =>
                productStmt.run(name, price)
            );

            productStmt.finalize(() => console.log('Seed data inserted.'));
        } else {
            console.log(`Database already contains ${row.count} pizzas — skipping seed.`);
        }
    });
});

module.exports = db;
