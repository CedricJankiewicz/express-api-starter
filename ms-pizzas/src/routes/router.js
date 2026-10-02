// routes/router.js
const express = require('express');
const productsRouter = require('./pizzas');

const router = express.Router();

router.use('/pizzas', productsRouter);

module.exports = router;
