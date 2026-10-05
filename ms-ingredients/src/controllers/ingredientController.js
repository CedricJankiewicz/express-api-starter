// controllers/pizzaController.js
const { validationResult } = require('express-validator');
const Ingredient = require('../entities/Ingredient');

/**
 * Controller functions use Express (req, res) signatures and
 * respond with status codes matching MDN/HTTP recommendations.
 */
exports.findAll = async (req, res, next) => {
    try {
        const ingredients = await Ingredient.findAll();
        // 200 OK
        return res.status(200).json(ingredients);
    } catch (err) {
        next(err);
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid ingredient id' });

        const ingredient = await Ingredient.findById(id);
        if (!ingredient) return res.status(404).json({ error: 'ingredient not found' }); // 404 Not Found

        return res.status(200).json(ingredient);
    } catch (err) {
        next(err);
    }
};