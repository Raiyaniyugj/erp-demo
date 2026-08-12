const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    type: { type: String, enum: ['Stock In', 'Stock Out'], required: true },
    quantity: { type: Number, required: true },
    reference: { type: String },
    remarks: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
