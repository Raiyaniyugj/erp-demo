const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// A stable, valid ObjectId for the demo admin bypass
const DEMO_ADMIN_ID = new mongoose.Types.ObjectId('000000000000000000000001');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret123', { expiresIn: '15m' }); // Short-lived access token
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret123', { expiresIn: '7d' }); // Long-lived refresh token
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Demo Bypass for Admin
        if (email === 'admin@demo.com' && password === 'admin123') {
            const token = generateToken(DEMO_ADMIN_ID);
            const refreshToken = generateRefreshToken(DEMO_ADMIN_ID);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            return res.json({
                _id: DEMO_ADMIN_ID,
                name: 'Admin User',
                email: 'admin@demo.com',
                role: 'Super Admin',
                token
            });
        }

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);
            const refreshToken = generateRefreshToken(user._id);
            
            // Set refresh token in HttpOnly cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            authProvider: 'local',
            role: 'Super Admin'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const { getApps, initializeApp } = require('firebase-admin/app');
const { getAuth: getAdminAuth } = require('firebase-admin/auth');

// Initialize Firebase Admin (uses Application Default Credentials or service account)
if (!getApps().length) {
    initializeApp({
        projectId: 'universal-erp-5457'
    });
}

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(401).json({ message: 'No refresh token provided' });

        jwt.verify(token, process.env.JWT_SECRET || 'supersecret123', (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Invalid refresh token' });
            
            const newAccessToken = generateToken(decoded.id);
            res.json({ token: newAccessToken });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;
        
        // Verify the Firebase ID token
        const decodedToken = await getAdminAuth().verifyIdToken(credential);
        const { email, name, uid: googleId } = decodedToken;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name: name || email.split('@')[0],
                email,
                googleId,
                authProvider: 'google',
                role: 'Super Admin'
            });
        } else {
            if (!user.googleId) {
                user.googleId = googleId;
                user.authProvider = 'google';
                await user.save();
            }
        }

        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });
    } catch (error) {
        console.error('Google login error:', error);
        res.status(401).json({ message: 'Invalid Google Token' });
    }
};

const logoutUser = (req, res) => {
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
};

const getProfile = async (req, res) => {
    try {
        if (req.user._id.toString() === DEMO_ADMIN_ID.toString()) {
            return res.json(req.user);
        }
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        if (req.user._id.toString() === DEMO_ADMIN_ID.toString()) {
            return res.status(403).json({ message: 'Demo Admin profile cannot be updated' });
        }
        
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { loginUser, registerUser, getProfile, refreshToken, logoutUser, googleLogin, updateProfile };
