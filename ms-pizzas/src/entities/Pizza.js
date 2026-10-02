// src/entities/Pizza.js
const db = require('../config/database');

const Pizza = {
    findAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM pizzas', (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM pizzas WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    insert(product) {
        const { name, price } = product;
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO pizzas (name, imageUrl, price) VALUES (?, ?, ?)`,
                [name, price],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, ...product });
                }
            );
        });
    },

    update(id, product) {
        const { name, price } = product;
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE pizzas SET name = ?, price = ?, updated_at = datetime('now') WHERE id = ?`,
                [name, price, id],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id, ...product });
                }
            );
        });
    },

    delete(id) {
        return new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM pizzas WHERE id = ?',
                [id],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.changes > 0); // true if a row was deleted
                }
            );
        });
    },

    findCompositions(productId) {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM pizzas_has_ingredients WHERE pizza_id = ?',
                [productId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    },

    insertComposition(pizzaId, ingredientId) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO pizzas_has_ingredients (pizza_id, ingredient_id)
         VALUES (?, ?)`,
                [pizzaId, ingredientId],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, pizzaId, ingredientId});
                }
            );
        });
    },

    deleteCompositions(id) {
        return new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM pizzas_has_ingredients WHERE id = ?',
                [id],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.changes > 0); // true if a row was deleted
                }
            );
        });
    },
};

module.exports = Pizza;
