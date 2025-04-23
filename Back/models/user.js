// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { sign } = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required : true
    },
    lastName : {
        type: String,
        required : true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mailFeedSubscription: {
        type: Boolean,
        default: false
    },
    mailFeedMail: {
        type: String,
        default: ''
    },
    cart: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart'
        }],
        default: []
    },
    notifications: [{
        notification: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userNotification',
        },
        notificationIsRead: {
            type: Boolean,
            default: false
        },
    }],
    pushNotificationsIsSubscribe: {
        type: Boolean,
        default: false
    },
    pushSubscription: {
        endpoint: { type: String },
        expirationTime: { type: Date, default: null },
        keys: {
            p256dh: { type: String },
            auth: { type: String }
        }
    },
    role: {
        type: String,
        default: 'autre', // Les valeurs possibles sont 'epitech', 'quadra', 'autre', 'superadmin'
    },
    token: {
        type: String
    },
    resetToken: {
        type: String
    },

    
}, { timestamps: true });

function forceUTF8(str) {
    return Buffer.from(str, 'utf8').toString('utf8');
  }
  
  // Fonction utilitaire pour capitaliser chaque mot
  function capitalizeWords(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  
// Hook "pre-save" pour forcer l'encodage UTF-8 et capitaliser chaque mot
UserSchema.pre('save', function (next) {
    try {
        if (this.firstName) {
            this.firstName = forceUTF8(this.firstName);
            this.firstName = capitalizeWords(this.firstName);
        }
        if (this.lastName) {
            this.lastName = forceUTF8(this.lastName);
            this.lastName = capitalizeWords(this.lastName);
        }
        if (this.email) {
            this.email = forceUTF8(this.email);
            this.email = this.email.toLowerCase();
        }
        next();
    } catch (error) {
        console.error('Erreur d\'encodage UTF-8:', error);
        next(error);  // Propager l'erreur pour gestion dans le contrôleur
    }
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', UserSchema);
