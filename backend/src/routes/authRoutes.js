const express = require('express');
const { loginUser, getProfile, refreshToken, logoutUser, googleLogin } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/refresh', refreshToken);
router.post('/logout', logoutUser);
router.get('/profile', protect, getProfile);

module.exports = router;
