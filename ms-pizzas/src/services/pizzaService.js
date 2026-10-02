// src/services/pizzaService.js
const PizzaEntity = require('../entities/Pizza');

const PRODUCT_ITEM_SERVICE_URL = process.env.PRODUCT_ITEM_SERVICE_URL || 'http://localhost:3000';

const PizzaService = {
    async getAll() {
        return PizzaEntity.findAll();
    },

    async getById(id) {
        return PizzaEntity.findById(id);
    },

    async create(product) {
        return PizzaEntity.insert(product);
    },

    async update(id, productData) {
        const existing = await PizzaEntity.findById(id);
        if (!existing) return null;

        return PizzaEntity.update(id, productData);
    },

    async delete(id) {
        const existing = await PizzaEntity.findById(id);
        if (!existing) return null;

        return PizzaEntity.delete(id);
    },

    async getProductWithItems(productId) {
        const product = await PizzaEntity.findById(productId);
        if (!product) throw new Error('Product not found');
        const compositions = await PizzaEntity.findCompositions(productId);
        const ingredients = await Promise.all(
            compositions.map(async (comp) => {
                const res = await fetch(`${PRODUCT_ITEM_SERVICE_URL}/api/ingredients/${comp.ingredient_id}`);
                if (!res.ok) throw new Error(`ProductItem ${comp.pizza_id} not found`);
                const itemData = await res.json();
                return { ...itemData };
            })
        );

        return { ...product, ingredients };
    },

    async addComposition(productId, item_id) {
        // Validate remote productItem via API
        const response = await fetch(`${PRODUCT_ITEM_SERVICE_URL}/api/ingredients/${item_id}`);
        if (!response.ok) throw new Error('Invalid productItem ID');

        return PizzaEntity.insertComposition(productId, item_id);
    },

    async getCompositions(productId) {
        return PizzaEntity.findCompositions(productId);
    },

    async deleteCompositions(id) {
        const existing = await PizzaEntity.findCompositions(id);
        if (!existing) return null;

        return PizzaEntity.deleteCompositions(id);
    }
};

module.exports = PizzaService;
