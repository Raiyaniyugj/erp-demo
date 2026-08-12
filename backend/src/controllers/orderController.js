const Order = require('../models/Order');
const Quotation = require('../models/Quotation');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const { logActivity } = require('./activityController');

exports.createOrder = async (req, res) => {
    try {
        const quote = await Quotation.findById(req.body.quotation);
        
        if (!quote || quote.status !== 'Approved') {
            return res.status(400).json({ message: 'Order can only be created from an Approved Quotation' });
        }

        const customer = await Customer.findById(quote.customer);
        if (customer.outstandingAmount + quote.grandTotal > customer.creditLimit) {
            return res.status(400).json({ message: 'Customer credit limit exceeded. Cannot create order.' });
        }

        const order = new Order({
            ...req.body,
            customer: quote.customer,
            products: quote.products,
            grandTotal: quote.grandTotal
        });
        
        const saved = await order.save();
        
        for (let item of saved.products) {
            await Product.findByIdAndUpdate(item.product, { $inc: { currentStock: -item.quantity } });
            await Inventory.create({
                product: item.product,
                type: 'Stock Out',
                quantity: item.quantity,
                reference: saved._id,
                remarks: 'Order Placed'
            });
        }

        await logActivity(req.user._id, 'CREATE', 'Order', `Created order ${saved.orderNumber}`);
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Not found' });

        if (req.body.orderStatus === 'Cancelled' && order.orderStatus !== 'Cancelled') {
            for (let item of order.products) {
                await Product.findByIdAndUpdate(item.product, { $inc: { currentStock: item.quantity } });
                await Inventory.create({
                    product: item.product,
                    type: 'Stock In',
                    quantity: item.quantity,
                    reference: order._id,
                    remarks: 'Order Cancelled'
                });
            }
        }

        order.orderStatus = req.body.orderStatus;
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('customer');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
