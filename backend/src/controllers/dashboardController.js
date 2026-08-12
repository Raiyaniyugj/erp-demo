const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Quotation = require('../models/Quotation');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalCustomers = await Customer.countDocuments({ isDeleted: false });
        const activeCustomers = await Customer.countDocuments({ isDeleted: false, status: 'Active' });
        const totalProducts = await Product.countDocuments({ status: 'Active' });
        const lowStockProducts = await Product.find({ $expr: { $lte: ['$currentStock', '$minimumStock'] }, status: 'Active' }).select('productName sku currentStock minimumStock');
        const totalQuotations = await Quotation.countDocuments();
        const pendingQuotations = await Quotation.countDocuments({ status: 'Draft' });
        const approvedQuotations = await Quotation.countDocuments({ status: 'Approved' });
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
        const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
        const cancelledOrders = await Order.countDocuments({ orderStatus: 'Cancelled' });
        const totalInvoices = await Invoice.countDocuments();
        const totalPayments = await Payment.countDocuments();

        const revenueAgg = await Payment.aggregate([
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

        const monthlyRevenue = await Payment.aggregate([
            {
                $group: {
                    _id: { $month: '$paymentDate' },
                    revenue: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const orderStatusChart = await Order.aggregate([
            { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
        ]);

        res.json({
            totalCustomers,
            activeCustomers,
            totalProducts,
            lowStockProducts,
            totalQuotations,
            pendingQuotations,
            approvedQuotations,
            totalOrders,
            pendingOrders,
            deliveredOrders,
            cancelledOrders,
            totalInvoices,
            totalPayments,
            totalRevenue,
            monthlyRevenue,
            orderStatusChart,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
