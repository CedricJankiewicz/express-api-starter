// routes/ingredients.js
const express = require('express');
const { body, param } = require('express-validator');
const ingredientController = require('../controllers/ingredientController');

const router = express.Router();

/**
 * @openapi
 * /api/ingredients:
 *   get:
 *     summary: Retrieve a list of ingredients
 *     tags:
 *       - Ingredients
 *     responses:
 *       200:
 *         description: A list of ingredients
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
 *                     example: Mozzarella
 *                   price:
 *                     type: number
 *                     format: float
 *                     example: 2.50
 *
 *   post:
 *     summary: Create a new ingredient
 *     tags:
 *       - Ingredients
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
 *                 description: Name of the ingredient
 *                 example: Mozzarella
 *               price:
 *                 type: number
 *                 format: float
 *                 exclusiveMinimum: 0
 *                 description: Price of the ingredient
 *                 example: 2.50
 *     responses:
 *       201:
 *         description: Ingredient created
 *       400:
 *         description: Invalid input
 */

/**
 * @openapi
 * /api/ingredients/{id}:
 *   get:
 *     summary: Get an ingredient by ID
 *     tags:
 *       - Ingredients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the ingredient
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Ingredient found
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
 *                   example: Mozzarella
 *                 price:
 *                   type: number
 *                   format: float
 *                   example: 2.50
 *       400:
 *         description: ID must be an integer
 *       404:
 *         description: Ingredient not found
 *
 *   put:
 *     summary: Update an ingredient by ID
 *     tags:
 *       - Ingredients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the ingredient
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
 *                 description: Name of the ingredient
 *                 example: Mozzarella
 *               price:
 *                 type: number
 *                 format: float
 *                 exclusiveMinimum: 0
 *                 description: Price of the ingredient
 *                 example: 2.50
 *     responses:
 *       200:
 *         description: Ingredient updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Ingredient not found
 *
 *   delete:
 *     summary: Delete an ingredient by ID
 *     tags:
 *       - Ingredients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the ingredient
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Ingredient deleted
 *       400:
 *         description: ID must be an integer
 *       404:
 *         description: Ingredient not found
 */

/**
 * Validation rules
 */
const createAndUpdateValidations = [
    body('name').isString().notEmpty().withMessage('name is required'),
    body('price').isFloat({ gt: 0 }).withMessage('price must be a positive number'),
];

router.get('/', ingredientController.findAll);
router.post('/', createAndUpdateValidations, ingredientController.create);
router.get('/:id', [param('id').isInt().withMessage('id must be an integer')], ingredientController.findOne);
router.put('/:id', [param('id').isInt().withMessage('id must be an integer'), ...createAndUpdateValidations], ingredientController.update);
router.delete('/:id', [param('id').isInt().withMessage('id must be an integer')], ingredientController.delete);

module.exports = router;
