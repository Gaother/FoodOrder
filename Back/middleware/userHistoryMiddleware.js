const mongoose = require('mongoose');
const userHistory = require('../models/userHistory'); // Chemin vers ton modèle UserHistory
const User = require('../models/user'); // Chemin vers ton modèle User

const userHistoryLogger = (commandType) => async (req) => {
    try {
        const UserHistoryModel = req.db.model('userHistory', userHistory.schema);
        const UserModel = req.db.model('User', User.schema);
        const userId = req.user && req.user._id ? req.user._id : null;

        if (!userId && commandType === 'register') {
            adminUserId = await UserModel.findOne({ role: 'superadmin' });
            await UserHistoryModel.create({
                userId: adminUserId._id,
                userCommand: commandType,
                userCommandData: JSON.stringify(req.body), // Stocker les données du filtre uniquement pour la recherche
            });
        }
        if (!userId)
            return; // Si aucun utilisateur n'est trouvé, passer au prochain middleware
        if (commandType !== 'connexion' && JSON.stringify(req.body) === '{}')
            return; 
        // Créer un objet pour l'historique de l'utilisateur
        const userHistoryData = await UserHistoryModel.create({
            userId: userId,
            userCommand: commandType,
            userCommandData: commandType === 'recherche' ? JSON.stringify(req.body) : null, // Stocker les données du filtre uniquement pour la recherche
        });
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'historique utilisateur:', error);
    }
};

module.exports = userHistoryLogger;