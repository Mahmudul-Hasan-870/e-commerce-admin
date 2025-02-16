const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const categoryRoutes = require('./routes/categories');


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
connectDB().catch((err) => {
    console.error(`Database connection error: ${err.message}`.red);
    process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/categories', categoryRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port: `.rainbow.bold, `${PORT}`.bold.red);
});
