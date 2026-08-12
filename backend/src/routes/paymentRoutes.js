const express = require('express');
const { createPayment, getPayments } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.route('/').get(getPayments).post(createPayment);

module.exports = router;
