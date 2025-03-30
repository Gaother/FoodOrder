const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  swaggerDefinition: {
    restapi: '3.0.0',
    info: {
      title: 'API intranet Cuisines et fourneaux',
      version: '1.0.0',
      description: 'This API serves as the backend for the intranet application "Cuisines et Fourneaux". It provides various routes and models for managing SMS, mail, order tracking, stock, and support functionalities.',
    },
    servers: [
      {
        url: 'http://localhost:2700',
      },
    ],
    components: {
        schemas: {
            Sms: {
                type: 'object',
                required: ['phoneNumber', 'text'],
                properties: {
                    _id: {
                        type: 'string',
                        description: 'ID auto-généré du SMS',
                    },
                    phoneNumber: {
                        type: 'string',
                        description: 'Numéro de téléphone du destinataire',
                    },
                    text: {
                        type: 'string',
                        description: 'Texte du SMS',
                    },
                    smsIsSent: {
                        type: 'boolean',
                        description: 'Statut d\'envoi du SMS',
                        default: false,
                    },
                    date: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Date de création du SMS',
                        default: new Date().toISOString(),
                    },
                },
            },
        },
    },
  },
  apis: [
    './routes/*.js',
    './routes/atlas-routes/*.js',
    './routes/mail-routes/*.js',
    './routes/order-tracking-routes/*.js',
    './routes/sms-routes/*.js',
    './routes/stock-routes/*.js',
    './models/*.js',
    './models/atlas-models/*.js',
    './models/mail-models/*.js',
    './models/order-tracking-models/*.js',
    './models/sms-models/*.js',
    './models/stock-models/*.js',
    './models/support-models/*.js',
    ],
}

const specs = swaggerJsdoc(options)

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
}