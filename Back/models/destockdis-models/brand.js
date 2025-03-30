// models/brand.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const BrandSchema = new Schema({
  brand: {
    type: String,
    required: true,
    unique: true
  },
});

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
BrandSchema.pre('save', function (next) {
  try {
    if (this.brand) {
      this.brand = forceUTF8(this.brand);
      this.brand = capitalizeWords(this.brand);
    }
    next();
  } catch (error) {
    console.error('Erreur d\'encodage UTF-8:', error);
    next(error);  // Propager l'erreur pour gestion dans le contrôleur
  }
});

module.exports = mongoose.model('brand', BrandSchema);