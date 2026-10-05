// routes/router.js
const express = require('express');
const ingredientsRouter = require('./pizzas');

const router = express.Router();

router.use('/pizzas', ingredientsRouter);

module.exports = router;
