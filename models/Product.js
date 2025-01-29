const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 255 },
    category: { type: String, required: true, maxlength: 255 },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number, default: null },
    stock: { type: Number, required: true },
    image: { type: String, required: true },
    colors: { type: [String], required: true },
    sizes: { type: [String], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
