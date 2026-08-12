const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Quotation = require('../models/Quotation');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');

exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const totalCustomers = await Customer.countDocuments({ isDeleted: false, createdBy: userId });
        const activeCustomers = await Customer.countDocuments({ isDeleted: false, status: 'Active', createdBy: userId });
        const totalProducts = await Product.countDocuments({ status: 'Active', createdBy: userId });
        const lowStockProducts = await Product.find({ $expr: { $lte: ['$currentStock', '$minimumStock'] }, status: 'Active', createdBy: userId }).select('productName sku currentStock minimumStock');
        const totalQuotations = await Quotation.countDocuments({ createdBy: userId });
        const pendingQuotations = await Quotation.countDocuments({ status: 'Draft', createdBy: userId });
        const approvedQuotations = await Quotation.countDocuments({ status: 'Approved', createdBy: userId });
        const totalOrders = await Order.countDocuments({ createdBy: userId });
        const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending', createdBy: userId });
        const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered', createdBy: userId });
        const cancelledOrders = await Order.countDocuments({ orderStatus: 'Cancelled', createdBy: userId });
        const totalInvoices = await Invoice.countDocuments({ createdBy: userId });
        const totalPayments = await Payment.countDocuments({ createdBy: userId });

        const revenueAgg = await Payment.aggregate([
            { $match: { createdBy: userId } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

        const monthlyRevenue = await Payment.aggregate([
            { $match: { createdBy: userId } },
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
            { $match: { createdBy: userId } },
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
