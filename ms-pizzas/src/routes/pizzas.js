// routes/pizzas.js
const express = require('express');
const { param } = require('express-validator');
const ingredientController = require('../controllers/pizzaController');

const router = express.Router();

/**
 * @openapi
 * /api/v1/productitems:
 *   get:
 *     summary: Retrieve a list of product items
 *     responses:
 *       200:
 *         description: A list of product items
 */

/**
 * @openapi
 * /api/v1/productitems/{id}:
 *   get:
 *     summary: Get a product item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single product item
 *       404:
 *         description: Product item not found
 */

router.get('/', ingredientController.findAll);
router.get('/:id', [param('id').isInt().withMessage('id must be an integer')], ingredientController.findOne);

module.exports = router;
