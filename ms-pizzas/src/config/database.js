// config/database.js (main-service)
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbFile = process.env.DB_FILE || path.join(__dirname, '..', 'compositions.sqlite');

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
CREATE TABLE IF NOT EXISTS pizzas_has_ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pizza_id INTEGER,
    ingredient_id INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (pizza_id) REFERENCES pizzas(id) ON DELETE CASCADE
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

    // Seed compositions only if empty
    db.get('SELECT COUNT(*) AS count FROM pizzas_has_ingredients', (err, row) => {
        if (err) {
            console.error('Error checking pizzas_has_ingredients', err);
            return;
        }

        if (row.count === 0) {
            console.log('Seeding product_compositions...');
            const stmt = db.prepare(`
            INSERT INTO pizzas_has_ingredients (pizza_id, ingredient_id)
            VALUES (?, ?)
        `);

            stmt.run(1, 1);
            stmt.run(1, 2);
            stmt.run(1, 3);

            stmt.run(2, 2);
            stmt.run(2, 4);
            stmt.run(2, 5);

            stmt.run(3, 2);

            stmt.run(4, 1);
            stmt.run(4, 3);
            stmt.run(4, 5);
            stmt.run(4, 6);
            stmt.run(4, 7);
            stmt.run(4, 8);

            stmt.run(5, 2);
            stmt.run(5, 4);
            stmt.run(5, 5);

            stmt.finalize(() => console.log('product_compositions seeded.'));
        }
    });
});

module.exports = db;
