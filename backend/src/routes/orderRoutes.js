const express = require('express');
const { createOrder, updateOrderStatus, getOrders, exportOrders } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/export', exportOrders);
router.route('/').get(getOrders).post(createOrder);
router.route('/:id').put(updateOrderStatus);

module.exports = router;
