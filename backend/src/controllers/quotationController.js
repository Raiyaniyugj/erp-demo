const Quotation = require('../models/Quotation');
const Product = require('../models/Product');
const { logActivity } = require('./activityController');

exports.createQuotation = async (req, res) => {
    try {
        let subTotal = 0;
        let gstTotal = 0;
        
        for (let item of req.body.products) {
            const product = await Product.findById(item.product);
            const lineTotal = item.quantity * item.unitPrice;
            subTotal += lineTotal;
            gstTotal += lineTotal * (product.gstPercentage / 100);
        }
        
        const grandTotal = (subTotal - (req.body.discount || 0)) + gstTotal;

        const quotation = new Quotation({
            ...req.body,
            subTotal,
            gst: gstTotal,
            grandTotal,
            createdBy: req.user._id
        });

        const saved = await quotation.save();
        await logActivity(req.user._id, 'CREATE', 'Quotation', `Created quotation ${saved.quotationNumber}`);
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateQuotation = async (req, res) => {
    try {
        const quotation = await Quotation.findOne({ _id: req.params.id, createdBy: req.user._id });
        if (!quotation) return res.status(404).json({ message: 'Not found or unauthorized' });
        
        if (quotation.status === 'Approved') {
            return res.status(400).json({ message: 'Approved quotation cannot be edited' });
        }

        if (new Date(quotation.validTill) < new Date()) {
            quotation.status = 'Expired';
            await quotation.save();
            return res.status(400).json({ message: 'Quotation has expired and cannot be edited' });
        }

        const updated = await Quotation.findOneAndUpdate({ _id: req.params.id, createdBy: req.user._id }, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.approveQuotation = async (req, res) => {
    try {
        const quotation = await Quotation.findOne({ _id: req.params.id, createdBy: req.user._id });
        if (!quotation) return res.status(404).json({ message: 'Not found or unauthorized' });

        quotation.status = 'Approved';
        await quotation.save();
        await logActivity(req.user._id, 'APPROVE', 'Quotation', `Approved quotation ${quotation.quotationNumber}`);
        res.json({ message: 'Quotation Approved' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getQuotations = async (req, res) => {
    try {
        const quotes = await Quotation.find({ createdBy: req.user._id }).populate('customer');
        res.json(quotes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
