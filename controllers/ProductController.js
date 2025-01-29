const path = require('path');
const Product = require('../models/Product');


exports.createProduct = async (req, res) => {
    const { name, category, description, price, salePrice, stock, image, colors, sizes } = req.body;

    try {
        const newProduct = new Product({
            name,
            category,
            description,
            price,
            salePrice: salePrice || null, // Default to null if not provided
            stock,
            image,
            colors,
            sizes,
        });

        await newProduct.save();
        res.status(201).json({ status: 'success', message: 'Product created successfully', data: newProduct });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal server error', error: error });
    }
};


exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ status: 'success', data: products });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};


exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }
        res.json({ status: 'success', data: product });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};


exports.updateProduct = async (req, res) => {
    const { name, category, description, price, salePrice, stock, image, colors, sizes } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, category, description, price, salePrice, stock, image, colors, sizes },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }

        res.json({ status: 'success', message: 'Product updated successfully', data: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};


exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }

        res.json({ status: 'success', message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};


exports.addProductPage = async  (req, res) => {
    res.sendFile(path.join(__dirname, '../public', '/addProduct/index.html'));
}