const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Otp = require('../models/Otp');

// Register
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'error', message: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ status: 'success', message: 'User registered successfully', token });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// Login
exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'error', message: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
        }

        // Set the user as logged in
        user.isLogged = true;
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ status: 'success', message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'error', message: errors.array() });
    }

    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await Otp.findOneAndUpdate(
            { email },
            { otp, expiresAt },
            { upsert: true, new: true }
        );

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        await transporter.sendMail({
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`,
        });

        res.json({ status: 'success', message: 'OTP sent to your email' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'error', message: errors.array() });
    }

    const { otp, password } = req.body;

    try {
        const otpRecord = await Otp.findOne({ otp, expiresAt: { $gt: new Date() } });
        if (!otpRecord) {
            return res.status(400).json({ status: 'error', message: 'Invalid or expired OTP' });
        }

        const user = await User.findOne({ email: otpRecord.email });
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        user.password = await bcrypt.hash(password, 10);
        await user.save();

        await Otp.deleteOne({ otp });

        res.json({ status: 'success', message: 'Password reset successful' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

// Profile (Fetch User Data)
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        res.json({ status: 'success', data: { name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};


// Logout
exports.logout = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);  // Get user from request object after middleware validation
        
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // Set the user as logged out
        user.isLogged = false;
        await user.save();

        res.json({ status: 'success', message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

