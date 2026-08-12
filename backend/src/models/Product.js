const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String },
    hsnCode: { type: String },
    purchasePrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    gstPercentage: { type: Number, required: true },
    unit: { type: String },
    currentStock: { type: Number, default: 0 },
    minimumStock: { type: Number, default: 0 },
    productImage: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
