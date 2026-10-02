// config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
require('dotenv').config();

const port = process.env.PORT || 3000;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Products API',
            version: '1.0.0',
            description: 'RESTful API for product management (SQLite, Express).'
        },
        servers: [
            {
                url: `http://localhost:${port}/api/v1`,
                description: 'Local development server'
            },
        ],
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js'] // pick up JSDoc in routes/controllers
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;