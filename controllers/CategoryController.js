const Category = require('../models/Category');

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
};

// Create new category
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Validate input
        if (!name || name.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

        // Check if category already exists
        const existingCategory = await Category.findOne({ name: name.trim() });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category already exists'
            });
        }

        // Create new category
        const category = new Category({
            name: name.trim()
        });

        await category.save();

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating category',
            error: error.message
        });
    }
};

// Delete category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting category',
            error: error.message
        });
    }
};

// Update category
exports.updateCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Validate input
        if (!name || name.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

        // Check if new name already exists for other category
        const existingCategory = await Category.findOne({
            name: name.trim(),
            _id: { $ne: req.params.id }
        });
        
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category name already exists'
            });
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name: name.trim() },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            message: 'Category updated successfully',
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating category',
            error: error.message
        });
    }
};

// Get single category
exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching category',
            error: error.message
        });
    }
};

// Get category names only
exports.getCategoryNames = async (req, res) => {
    try {
        const categories = await Category.find().select('name').sort({ name: 1 });
        const categoryNames = categories.map(category => category.name);
        
        res.json({
            success: true,
            categories: categoryNames
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching category names',
            error: error.message
        });
    }
}; 