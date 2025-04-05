// models/product.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  // MARQUE	- EAN	- REFERENCE	- DÉSIGNATION - PRIX UNITAIRE HT -	FAMILLE 1	- FAMILLE 3	- STOCK	-- DATE DE RECEPTTION	COMMANDE
  reference: {
    type: String,
    required: true,
    unique: true
  },
  normalizedReference: {
    type: String,
    unique: true
  },
  nom: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  reception : {
    type: Date,
    default: Date.now
  },
  comment : {
    type: String
  },

  specifications : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'productSpecificationsValue'
  }],

  active : {
    type: Boolean,
    required: true,
    default: true
  },
 //Famille 1 famille 2 marque nom reference EAN prix stock



  // imageLink: {
  //   type: String,
  // },

  
  // priceHistories: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'PriceHistory'
  // }],
  // reportHistories: [{
  //   type: Schema.Types.ObjectId,
  //   ref: 'ProductReport'
  // }]
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

// Hook "pre-save" pour forcer l'encodage UTF-8
ProductSchema.pre('save', function (next) {
  try {
    if (this.reference) {
      this.reference = forceUTF8(this.reference);
      this.reference = this.reference.toUpperCase();
      this.normalizedReference = this.reference.replace(/[\s/-]/g, '').toLowerCase();
    }
    if (this.nom) {
      this.nom = forceUTF8(this.nom);
      this.nom = capitalizeString(this.nom);
    }
    if (this.comment) {
      this.comment = forceUTF8(this.comment);
      this.comment = capitalizeString(this.comment);
    }
    next();
  } catch (error) {
    console.error('Erreur d\'encodage UTF-8:', error);
    next(error);  // Propager l'erreur pour gestion dans le contrôleur
  }
});

module.exports = mongoose.model('Product', ProductSchema);
