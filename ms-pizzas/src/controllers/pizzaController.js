const PizzaService = require('../services/pizzaService');

const PizzaController = {
    // GET /api/v1/products
    async findAll(req, res) {
        try {
            let pizzas_ingredients = []
            const pizzas = await PizzaService.getAll();
            for (let pizza of pizzas) {
                pizzas_ingredients.push(await PizzaService.getProductWithItems(pizza.id))
            }
            res.json(pizzas_ingredients);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/v1/products/:id
    async findOne(req, res) {
        try {
            const pizza = await PizzaService.getProductWithItems(req.params.id);
            if (!pizza) return res.status(404).json({ error: 'Pizza not found' });
            res.json(pizza);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // POST /api/v1/products
    async create(req, res) {
        try {
            const pizza = await PizzaService.create(req.body);
            res.status(201).json(pizza);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // PUT /api/v1/products/:id/
    async update(req, res) {
        try {
            const { id } = req.params;
            const pizza = await PizzaService.update(id, req.body);
            if (!pizza) return res.status(404).json({ error: 'Product not found' });
            res.json(pizza);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // DELETE /api/v1/products/:id/
    async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await PizzaService.delete(id);
            if (!deleted) return res.status(404).json({ error: 'Product not found' });
            res.status(204).send(); // 204 No Content
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/v1/products/:id/full
    // Returns product + list of items
    async getProductWithItems(req, res) {
        try {
            const { id } = req.params;
            const product = await PizzaService.getProductWithItems(id);
            res.json(product);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    // POST /api/v1/products/:id/compositions
    async addComposition(req, res) {
        try {
            const { id } = req.params;
            const { item_id, quantity, unit } = req.body;
            const composition = await PizzaService.addComposition(id, item_id, quantity, unit);
            res.status(201).json(composition);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // GET /api/v1/products/:id/compositions
    async getCompositions(req, res) {
        try {
            const { id } = req.params;
            const compositions = await PizzaService.getCompositions(id);
            res.json(compositions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/v1/products/:id/compositions
    async deleteCompositions(req, res) {
        try {
            const { id } = req.params;
            const deleted = await PizzaService.deleteCompositions(id);
            if (!deleted) return res.status(404).json({ error: 'Composition not found' });
            res.status(204).send(); // 204 No Content
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = PizzaController;
