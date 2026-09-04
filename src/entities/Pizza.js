// entities/Pizza.js
const db = require('../config/database');

class Pizza {
    static async create({ name, imageUrl, price, ingredients = [] }) {
        // Create pizza
        const pizzaId = await new Promise((resolve, reject) => {
            const sql = `
            INSERT INTO pizzas
            (name, imageUrl, price, created_at, updated_at)
            VALUES (?, ?, ?, datetime('now'), datetime('now'))
        `;

            db.run(sql, [name, imageUrl || null, price], function (err) {
                if (err) return reject(err);
                resolve(this.lastID);
            });
        });

        // Create ingredients and relations
        for (const ingredientName of ingredients) {

            // Check if ingredient already exists
            let ingredient = await new Promise((resolve, reject) => {
                db.get(
                    `SELECT * FROM ingredients WHERE name = ?`,
                    [ingredientName],
                    (err, row) => {
                        if (err) return reject(err);
                        resolve(row);
                    }
                );
            });

            let ingredientId;

            if (ingredient) {
                ingredientId = ingredient.id;
            } else {
                // Create ingredient
                ingredientId = await new Promise((resolve, reject) => {
                    const sql = `
                    INSERT INTO ingredients
                    (name, price, created_at, updated_at)
                    VALUES (?, ?, datetime('now'), datetime('now'))
                `;

                    db.run(sql, [ingredientName, 1], function (err) {
                        if (err) return reject(err);
                        resolve(this.lastID);
                    });
                });
            }

            // Link pizza ↔ ingredient
            await new Promise((resolve, reject) => {
                const sql = `
                INSERT INTO pizzas_has_ingredients
                (pizza_id, ingredient_id, created_at, updated_at)
                VALUES (?, ?, datetime('now'), datetime('now'))
            `;

                db.run(sql, [pizzaId, ingredientId], function (err) {
                    if (err) return reject(err);
                    resolve();
                });
            });
        }

        return Pizza.findById(pizzaId);
    }

    static async findAll() {
        const pizzas = await new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM pizzas ORDER BY id DESC`,
                [],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
                }
            );
        });

        for (const pizza of pizzas) {
            pizza.ingredients = await new Promise((resolve, reject) => {
                db.all(
                    `
                        SELECT i.name
                        FROM ingredients i
                                 INNER JOIN pizzas_has_ingredients phi
                                            ON phi.ingredient_id = i.id
                        WHERE phi.pizza_id = ?
                    `,
                    [pizza.id],
                    (err, rows) => {
                        if (err) return reject(err);

                        resolve(rows.map(row => row.name));
                    }
                );
            });
        }

        return pizzas;
    }

    static findById(id) {
        const sql = `SELECT * FROM pizzas WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row || null);
            });
        });
    }

    static update(id, { name, imageUrl, price }) {
        const sql = `
      UPDATE pizzas
      SET name = COALESCE(?, name),
          imageUrl = COALESCE(?, imageUrl),
          price = COALESCE(?, price),
          updated_at = datetime('now')
      WHERE id = ?
    `;
        const params = [name, imageUrl, price, id];

        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) return reject(err);
                if (this.changes === 0) return resolve(null);
                Pizza.findById(id).then(resolve).catch(reject);
            });
        });
    }

    static delete(id) {
        const sql = `DELETE FROM pizzas WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [id], function (err) {
                if (err) return reject(err);
                resolve(this.changes); // number of rows deleted
            });
        });
    }
}

module.exports = Pizza;
