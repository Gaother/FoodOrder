// models/product.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSpecificationsSchema = new Schema({
    index: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    values: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'productSpecificationsValue'
    }]
});

function forceUTF8(str) {
    return Buffer.from(str, 'utf8').toString('utf8');
  }
  
// Fonction utilitaire pour capitaliser chaque mot
function capitalizeString(str) {
    if (/^\d/.test(str)) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
  }

// Hook "pre-save" pour forcer l'encodage UTF-8 et capitaliser chaque mot
ProductSpecificationsSchema.pre('save', function (next) {
    try {
        if (this.name) {
        this.name = forceUTF8(this.name);
        this.name = capitalizeString(this.name);
        }
        next();
    } catch (error) {
        console.error('Erreur d\'encodage UTF-8:', error);
        next(error);  // Propager l'erreur pour gestion dans le contrôleur
    }
});

module.exports = mongoose.model('productSpecifications', ProductSpecificationsSchema);