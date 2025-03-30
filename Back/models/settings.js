// models/settings.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SettingsSchema = new Schema({
    orderBlacklist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
});

module.exports = mongoose.model('Settings', SettingsSchema);
