const SwaggerDefinition = require('swagger-jsdoc').SwaggerDefinition;

const swaggerOptions = {
  apis: [`${__dirname}/../routers/*.js`], // Ensure this path is correctly pointing to your routes
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API starter TS',
      description: 'API basic avec authentification sécurisé par jwt',
      contact: {
        name: 'Tydaks',
      },
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    
  },

  info: {
    title: 'Express API starter TS',
    description: 'API basic avec authentification sécurisé par jwt',
    contact: {
      name: 'Tydaks',
    },
    version: '1.0.0',
  },
}

module.exports = swaggerOptions;