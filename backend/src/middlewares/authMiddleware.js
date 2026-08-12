const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

// Must match the same ObjectId used in authController.js
const DEMO_ADMIN_ID = new mongoose.Types.ObjectId('000000000000000000000001');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret123');
            if (decoded.id === DEMO_ADMIN_ID.toString()) {
                req.user = { _id: DEMO_ADMIN_ID, name: 'Admin User', email: 'admin@demo.com', role: 'Super Admin' };
            } else {
                req.user = await User.findById(decoded.id).select('-password');
            }
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'User role not authorized' });
        }
        next();
    };
};

module.exports = { protect, authorize };
