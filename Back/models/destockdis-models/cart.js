// models/cart.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('./product');

// Fonction utilitaire pour générer une chaîne aléatoire de 10 lettres
function generateOrderID() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return result;
}


const CartSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderID: {
    type: String,
    unique: true
  },
  adminValidated: {
    type: Boolean,
    default: false
  },
  adminCanceled: {
    type: Boolean,
    default: false
  },
  userValidated: {
    type: Boolean,
    default: false
  },
  userCanceled: {
    type: Boolean,
    default: false
  },
  dateUserValidation: {
    type: Date
  },
  dateAdminValidation: {
    type: Date
  },
  dateLivraison: {
    type: Date
  },
  comment: {
    type: String
  },
  note : {
    type: String
  },
  lieuLivraison: {
    type: String
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    discount: {
      type: Number
    },
    specifications: {
      type: Array,
    },
  }]
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

// Fonction utilitaire pour générer un orderID unique
async function generateUniqueOrderID() {
  let uniqueID = generateOrderID();
  // Vérifie si l'orderID existe déjà
  while (await mongoose.models.Cart.exists({ orderID: uniqueID })) {
    uniqueID = generateOrderID(); // Génère un nouvel orderID si celui-ci existe déjà
  }
  return uniqueID;
}

// Hook "pre-save" pour forcer l'encodage UTF-8 et capitaliser chaque mot
CartSchema.pre('save', async function (next) {
  try {
    for (let item of this.products) {
      if (!item.price || item.price === 0) {
      const product = await mongoose.models.Product.findById(item.product);
      if (product) {
        item.price = product.price;
      }
    }
  }
    if (this.comment) {
      this.comment = forceUTF8(this.comment);
    }
    if (this.note) {
      this.note = forceUTF8(this.note);
    }
    if (!this.orderID) {
      this.orderID = await generateUniqueOrderID();
    }
    if (!this.lieuLivraison) {
      if (this.user && this.user.role === 'epitech') {
        this.lieuLivraison = forceUTF8("Epitech");
      }
      else if (this.user && this.user.role === 'quadra') {
        this.lieuLivraison = forceUTF8("Quadra-Diffusion");
      }
    }
    next();
  } catch (error) {
    console.error("Erreur lors de la génération de l'orderID:", error);
    next(error);  // Propager l'erreur pour gestion dans le contrôleur
  }
});

module.exports = mongoose.model('Cart', CartSchema);
