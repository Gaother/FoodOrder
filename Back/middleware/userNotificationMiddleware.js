const mongoose = require('mongoose');
const userHistory = require('../models/userHistory'); // Chemin vers ton modèle UserHistory
const user = require('../models/user'); // Chemin vers ton modèle User
const userNotification = require('../models/userNotification'); // Chemin vers ton modèle UserNotification


const notificationLogger = {
    async logger(db, notificationType, notificationContent, userID=[""], role=[""]) {
        try {
            const UserNotificationModel = db.model('userNotification', userNotification.schema);
            const UserModel = db.model('User', user.schema);

            const userNotificationData = await UserNotificationModel.create({
                notificationType: notificationType,
                content: notificationContent,
            });
            if (Array.isArray(userID) && userID.length > 0 && userID[0] !== "") {
                for (let id of userID) {
                    const user = await UserModel.findById(id);
                    if (user) {
                        user.notifications.push({notification: userNotificationData._id});
                        await user.save();
                    }
                }
                return;
            }
            if (Array.isArray(role) && role.length > 0 && role[0] !== "") {
                const users = await UserModel.find({ role: { $in: role } });
                for (let user of users) {
                    user.notifications.push({notification: userNotificationData._id});
                    await user.save();
                }
                return;
            }
            if (userID === "" && role === "") {
                const users = await UserModel.find({ role: { $in: ['superadmin'] } });
                for (let user of users) {
                    user.notifications.push({notification: userNotificationData._id});
                    await user.save();
                }
            }
        } catch (error) {
            console.error('Erreur lors de la création de la notification :', error);
        }
    }
}

module.exports = notificationLogger;
