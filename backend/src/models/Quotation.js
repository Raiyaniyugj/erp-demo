const mongoose = require('mongoose');

const quotationItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
});

const quotationSchema = new mongoose.Schema({
    quotationNumber: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    products: [quotationItemSchema],
    discount: { type: Number, default: 0 },
    subTotal: { type: Number, required: true },
    gst: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    validTill: { type: Date, required: true },
    remarks: { type: String },
    status: { type: String, enum: ['Draft', 'Sent', 'Approved', 'Rejected', 'Expired'], default: 'Draft' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Quotation', quotationSchema);
