// routes/pizzas.js
const express = require('express');
const { body, param } = require('express-validator');
const ingredientController = require('../controllers/ingredientController');

const router = express.Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Retrieve a list of products
 *     responses:
 *       200:
 *         description: A list of products
 */

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single product
 *       404:
 *         description: Product not found
 */

/**
 * Validation rules
 */
/*
const createAndUpdateValidations = [
    body('name').isString().notEmpty().withMessage('name is required'),
    body('price').isFloat({ gt: 0 }).withMessage('price must be a positive number'),
];
*/
router.get('/', ingredientController.findAll);
//router.post('/', createAndUpdateValidations, ingredientController.create);
router.get('/:id', [param('id').isInt().withMessage('id must be an integer')], ingredientController.findOne);
//router.put('/:id', [param('id').isInt().withMessage('id must be an integer'), ...createAndUpdateValidations], ingredientController.update);
//router.delete('/:id', [param('id').isInt().withMessage('id must be an integer')], ingredientController.delete);

module.exports = router;
