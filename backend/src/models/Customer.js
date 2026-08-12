const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    companyName: { type: String },
    gstNumber: { type: String },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    customerType: { type: String, enum: ['B2B', 'B2C'], default: 'B2B' },
    creditLimit: { type: Number, default: 0 },
    outstandingAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    isDeleted: { type: Boolean, default: false },
    salesExecutive: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
