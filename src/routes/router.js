// routes/router.js
const express = require('express');
const pizzasRouter = require('./pizzas');
const ingredientsRouter = require('./ingredients');
const pizzasHasIngredientsRouter = require('./pizzas_has_ingredients');

const router = express.Router();

router.use('/pizzas', pizzasRouter);

router.use('/ingredients', ingredientsRouter);

router.use('/pizzasHasIngredients', pizzasHasIngredientsRouter);

module.exports = router;
