// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userCommand: {
        type: String,
        required: true,
    },
    userCommandData: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('userHistory', UserHistorySchema);
