const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    quotation: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation', required: true },
    products: [orderItemSchema],
    deliveryDate: { type: Date, required: true },
    shippingAddress: { type: String },
    paymentStatus: { type: String, enum: ['Pending', 'Partial', 'Paid'], default: 'Pending' },
    orderStatus: { type: String, enum: ['Pending', 'Processing', 'Packed', 'Dispatched', 'Delivered', 'Cancelled'], default: 'Pending' },
    grandTotal: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
