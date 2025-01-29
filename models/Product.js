const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number, default: null },
    stock: { type: Number, required: true },
    image: { type: String },
    colors: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
});

module.exports = mongoose.model('Product', productSchema);
