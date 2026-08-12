const express = require('express');
const { createInvoice, getInvoices, generatePDF, emailInvoice } = require('../controllers/invoiceController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.route('/').get(getInvoices).post(createInvoice);
router.get('/:id/pdf', generatePDF);
router.post('/:id/email', emailInvoice);

module.exports = router;
