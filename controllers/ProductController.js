const path = require('path');
const Product = require('../models/Product');

// Create product with image handling
exports.createProduct = async (req, res) => {
    const { name, category, description, price, salePrice, stock, colors, sizes } = req.body;
    
    // Ensure the image is handled correctly
    const image = req.file ? req.file.filename : null;  // Get the uploaded image filename (with extension)

    try {
        const newProduct = new Product({
            name,
            category,
            description,
            price,
            salePrice: salePrice || null,
            stock,
            image,  // Save image filename with extension
            colors,
            sizes,
        });

        await newProduct.save();
        res.status(201).json({ status: 'success', message: 'Product created successfully', data: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error', error: error });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ status: 'success', data: products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// Get a product by its ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }
        res.json({ status: 'success', data: product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    const { name, category, description, price, salePrice, stock, colors, sizes } = req.body;
    
    // Handle image if it was uploaded
    const image = req.file ? req.file.filename : null;

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
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }

        res.json({ status: 'success', message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// Serve Add Product page (HTML form)
exports.addProductPage = async (req, res) => {
    res.sendFile(path.join(__dirname, '../public', '/addProduct/index.html'));
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
};
