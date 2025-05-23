// mongodb_link.js
require('dotenv').config();
const mongoose = require('mongoose');

let dbConnection = null; // Variable pour stocker la connexion

const connectDB = async () => {
    if (dbConnection) {
        // Si la connexion existe déjà, on la renvoie
        return dbConnection;
    }

    try {
        const MONGODB_URI = process.env.MONGODB_URI;

        // Connexion à MongoDB
        const connection = await mongoose.connect(MONGODB_URI);

        console.log('Connexion à MongoDB réussie...');
        // Utiliser la base de données "intranet"
        dbConnection = connection.connection.useDb('foodOrders');
        console.log('Base de données par défaut définie sur "foodOrders"...');

        return dbConnection; // Retourne l'instance de la connexion

    } catch (err) {
        console.error('Erreur de connexion à MongoDB:', err.message);
        throw err; // Lancer une erreur si la connexion échoue
    }
};

module.exports = connectDB;