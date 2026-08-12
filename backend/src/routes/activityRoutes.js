const express = require('express');
const { getActivities } = require('../controllers/activityController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/', authorize('Super Admin', 'Manager'), getActivities);

module.exports = router;
