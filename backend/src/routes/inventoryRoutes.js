const express = require('express');
const Inventory = require('../models/Inventory');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
    try {
        let query = {};
        if (req.query.product) query.product = req.query.product;
        const logs = await Inventory.find(query).populate('product', 'productName sku').sort({ createdAt: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
