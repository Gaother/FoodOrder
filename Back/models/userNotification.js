// models/userNotification.js
const mongoose = require('mongoose');

const UserNotificationSchema = new mongoose.Schema({
    notificationType: {
        type: String,
        required: true, // Les valeurs possibles sont 'order', 'user', 'message'
    },
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('userNotification', UserNotificationSchema);
