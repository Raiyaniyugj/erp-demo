const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');

exports.createPayment = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.body.invoice);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

        const payment = new Payment({
            ...req.body,
            customer: invoice.customer
        });

        const saved = await payment.save();

        await Customer.findByIdAndUpdate(invoice.customer, { $inc: { outstandingAmount: -req.body.amount } });

        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('customer').populate('invoice');
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
