const express = require('express');
const multer = require('multer');
const upload = multer({ dest: '/tmp' });
const { createProduct, getProducts, updateProduct, deleteProduct, exportProducts, importProducts } = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/export', exportProducts);
router.post('/import', upload.single('file'), authorize('Super Admin', 'Manager'), importProducts);

router.route('/').get(getProducts).post(authorize('Super Admin', 'Manager'), createProduct);
router.route('/:id').put(authorize('Super Admin', 'Manager'), updateProduct).delete(authorize('Super Admin', 'Manager'), deleteProduct);

module.exports = router;
