// routes/pizzas.js
const express = require('express');
const { body, param } = require('express-validator');
const pizzaHasIngredientController = require('../controllers/pizzaHasIngredientController');

const router = express.Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Retrieve a list of pizzas
 *     tags:
 *       - Pizzas
 *     responses:
 *       200:
 *         description: A list of pizzas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Margherita
 *                   imageUrl:
 *                     type: string
 *                     format: uri
 *                     example: https://example.com/images/margherita.jpg
 *                   price:
 *                     type: number
 *                     format: float
 *                     example: 12.50
 *
 *   post:
 *     summary: Create a new pizza
 *     tags:
 *       - Pizzas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 description: Name of the pizza
 *                 example: Margherita
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *                 description: URL of the pizza image
 *                 example: https://example.com/images/margherita.jpg
 *               price:
 *                 type: number
 *                 format: float
 *                 exclusiveMinimum: 0
 *                 description: Price of the pizza
 *                 example: 12.50
 *     responses:
 *       201:
 *         description: Pizza created
 *       400:
 *         description: Invalid input
 */

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     summary: Get a pizza by ID
 *     tags:
 *       - Pizzas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the pizza
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: A single pizza
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Margherita
 *                 imageUrl:
 *                   type: string
 *                   format: uri
 *                   example: https://example.com/images/margherita.jpg
 *                 price:
 *                   type: number
 *                   format: float
 *                   example: 12.50
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Pizza not found
 *
 *   put:
 *     summary: Update a pizza by ID
 *     tags:
 *       - Pizzas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the pizza
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 description: Name of the pizza
 *                 example: Margherita
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *                 description: URL of the pizza image
 *                 example: https://example.com/images/margherita.jpg
 *               price:
 *                 type: number
 *                 format: float
 *                 exclusiveMinimum: 0
 *                 description: Price of the pizza
 *                 example: 12.50
 *     responses:
 *       200:
 *         description: Pizza updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Pizza not found
 *
 *   delete:
 *     summary: Delete a pizza by ID
 *     tags:
 *       - Pizzas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the pizza
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Pizza deleted
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Pizza not found
 */

/**
 * Validation rules
 */
const createAndUpdateValidations = [
    body('name').isString().notEmpty().withMessage('name is required'),
    body('imageUrl').optional().isString().isURL().withMessage('imageUrl must be a valid URL'),
    body('price').isFloat({ gt: 0 }).withMessage('price must be a positive number'),
    body('ingredients').isArray()
];

router.get('/', pizzaHasIngredientController.findAll);
//router.post('/', createAndUpdateValidations, pizzaHasIngredientController.create);
router.get('/:id', [param('id').isInt().withMessage('id must be an integer')], pizzaHasIngredientController.findOne);
//router.put('/:id', [param('id').isInt().withMessage('id must be an integer'), ...createAndUpdateValidations], pizzaHasIngredientController.update);
//router.delete('/:id', [param('id').isInt().withMessage('id must be an integer')], pizzaHasIngredientController.delete);

module.exports = router;
