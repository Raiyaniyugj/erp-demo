const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    paymentMode: { type: String, enum: ['Cash', 'UPI', 'Bank Transfer', 'Cheque'], required: true },
    transactionReference: { type: String },
    remarks: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
