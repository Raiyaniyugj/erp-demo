const Customer = require('../models/Customer');
const Quotation = require('../models/Quotation');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');

exports.getCustomers = async (req, res) => {
    try {
        let query = { isDeleted: false, createdBy: req.user._id };
        
        if (req.query.search) {
            query.$or = [
                { customerName: { $regex: req.query.search, $options: 'i' } },
                { companyName: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } },
                { phoneNumber: { $regex: req.query.search, $options: 'i' } },
            ];
        }

        const customers = await Customer.find(query).populate('salesExecutive', 'name email');
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id, createdBy: req.user._id }).populate('salesExecutive', 'name email');
        if (!customer || customer.isDeleted) return res.status(404).json({ message: 'Customer not found' });
        
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const { logActivity } = require('./activityController');

exports.createCustomer = async (req, res) => {
    try {
        const customer = new Customer({
            ...req.body,
            salesExecutive: req.user.role === 'Sales Executive' ? req.user._id : req.body.salesExecutive,
            createdBy: req.user._id
        });
        const savedCustomer = await customer.save();
        await logActivity(req.user._id, 'CREATE', 'Customer', `Created customer ${savedCustomer.customerName}`);
        res.status(201).json(savedCustomer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id, createdBy: req.user._id });
        if (!customer) return res.status(404).json({ message: 'Customer not found or not authorized' });

        const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCustomer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id, createdBy: req.user._id });
        if (!customer) return res.status(404).json({ message: 'Customer not found or not authorized' });

        const quotes = await Quotation.findOne({ customer: req.params.id });
        const orders = await Order.findOne({ customer: req.params.id });
        const invoices = await Invoice.findOne({ customer: req.params.id });

        if (quotes || orders || invoices) {
            return res.status(400).json({ message: 'Cannot delete customer with existing quotations, orders, or invoices.' });
        }

        customer.isDeleted = true;
        await customer.save();
        res.json({ message: 'Customer soft deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const { Parser } = require('json2csv');
const csv = require('csv-parser');
const fs = require('fs');

exports.exportCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({ isDeleted: false, createdBy: req.user._id }).lean();
        const fields = ['customerName', 'companyName', 'email', 'phoneNumber', 'address', 'city', 'state', 'pincode', 'creditLimit'];
        const json2csvParser = new Parser({ fields });
        const csvData = json2csvParser.parse(customers);

        res.header('Content-Type', 'text/csv');
        res.attachment('customers.csv');
        return res.send(csvData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.importCustomers = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                // Attach current user as sales exec for imports if needed, or default
                const formatted = results.map(row => ({
                    ...row,
                    salesExecutive: req.user._id,
                    createdBy: req.user._id,
                    creditLimit: row.creditLimit || 0
                }));
                await Customer.insertMany(formatted);
                fs.unlinkSync(req.file.path); // remove temp file
                res.status(201).json({ message: `${results.length} customers imported successfully` });
            } catch (error) {
                fs.unlinkSync(req.file.path);
                res.status(400).json({ message: error.message });
            }
        });
};
