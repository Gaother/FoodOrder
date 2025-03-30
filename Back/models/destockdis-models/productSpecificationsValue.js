// models/product.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSpecificationsValueSchema = new Schema({
    value: {
        type: String,
        unique: true
    },
    key : {
        type: String,
        unique: true
    },
    specification: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'productSpecifications',
        required: true
    }
});

ProductSpecificationsValueSchema.pre('save', function(next) {
    this.key = this.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    next();
});


module.exports = mongoose.model('productSpecificationsValue', ProductSpecificationsValueSchema);