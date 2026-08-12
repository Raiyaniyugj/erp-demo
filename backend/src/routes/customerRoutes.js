const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { createCustomer, getCustomers, getCustomer, updateCustomer, deleteCustomer, exportCustomers, importCustomers } = require('../controllers/customerController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/export', exportCustomers);
router.post('/import', upload.single('file'), importCustomers);

router.route('/').get(getCustomers).post(createCustomer);
router.route('/:id').get(getCustomer).put(updateCustomer).delete(deleteCustomer);

module.exports = router;
