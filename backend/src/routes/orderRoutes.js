const express = require('express');
const { createOrder, updateOrderStatus, getOrders } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.route('/').get(getOrders).post(createOrder);
router.route('/:id').put(updateOrderStatus);

module.exports = router;
