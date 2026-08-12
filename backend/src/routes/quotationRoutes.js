const express = require('express');
const { createQuotation, updateQuotation, approveQuotation, getQuotations } = require('../controllers/quotationController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.route('/').get(getQuotations).post(createQuotation);
router.route('/:id').put(updateQuotation);
router.post('/:id/approve', approveQuotation);

module.exports = router;
