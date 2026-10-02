// config/database.js (product-service)
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbFile = process.env.DB_FILE || path.join(__dirname, '..', 'products.sqlite');

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

-- No real FK to productItems here (it’s managed by API validation)
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
            console.log(`Database already contains ${row.count} products — skipping seed.`);
        }
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
