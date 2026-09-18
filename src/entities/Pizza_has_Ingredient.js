// entities/Pizza.js
const db = require('../config/database');
const Pizza = require('./Pizza')
const Ingredient = require('./Ingredient')

class Pizza_has_Ingredient {
    /*
    static create({ name, imageUrl, price }) {
        const sql = `INSERT INTO pizzas (name, imageUrl, price, created_at, updated_at)
                 VALUES (?, ?, ?, datetime('now'), datetime('now'))`;
        const params = [name, imageUrl, price];

        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) return reject(err);
                // fetch created row
                Pizza.findById(this.lastID).then(resolve).catch(reject);
            });
        });
    }
    */

    static async findAll() {
        let pizzas = await Pizza.findAll()
        // get pizzas
        for (let pizza of pizzas){
            const sql = `SELECT ingredient_id FROM pizzas_has_ingredients WHERE pizza_id = ?`;
            let ingredients_id = await new Promise((resolve, reject) => {
                db.all(sql, [pizza.id], (err, row) => {
                    if (err) return reject(err);
                    resolve(row || null);
                });
            });
            // get ingredients in pizza
            let ingredients = []
            for (let ingredient_id of ingredients_id) {

                ingredients.push(await Ingredient.findById(ingredient_id.ingredient_id))
            }

            pizza.ingredients = ingredients
        }
        return pizzas
    }

    static async findById(id) {
        let pizza = await Pizza.findById(id)

        if (!pizza) {
            return null;
        }

        const sql = `SELECT ingredient_id FROM pizzas_has_ingredients WHERE pizza_id = ?`;
        let ingredients_id = await new Promise((resolve, reject) => {
            db.all(sql, [pizza.id], (err, row) => {
                if (err) return reject(err);
                resolve(row || null);
            });
        });

        let ingredients = []
        for (let ingredient_id of ingredients_id) {
            ingredients.push(await Ingredient.findById(ingredient_id.ingredient_id))
        }

        pizza.ingredients = ingredients
        return pizza
    }
    /*
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
    */
}

module.exports = Pizza_has_Ingredient;
