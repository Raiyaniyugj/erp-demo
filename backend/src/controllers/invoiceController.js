const Invoice = require('../models/Invoice');
const Order = require('../models/Order');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

exports.createInvoice = async (req, res) => {
    try {
        const order = await Order.findById(req.body.order);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        const existing = await Invoice.findOne({ order: req.body.order, createdBy: req.user._id });
        if (existing) {
            return res.status(400).json({ message: 'Invoice already exists for this order.' });
        }

        const invoice = new Invoice({
            ...req.body,
            customer: order.customer,
            subTotal: order.grandTotal,
            gst: 0,
            grandTotal: order.grandTotal,
            createdBy: req.user._id
        });

        const saved = await invoice.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({ createdBy: req.user._id }).populate('customer').populate('order');
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.generatePDF = async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ _id: req.params.id, createdBy: req.user._id })
            .populate('customer')
            .populate({
                path: 'order',
                populate: { path: 'products.product' }
            });

        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);
        doc.pipe(res);

        // Header
        doc.fontSize(20).text('INVOICE', { align: 'center' }).moveDown();
        doc.fontSize(12).text(`Invoice Number: ${invoice.invoiceNumber}`);
        doc.text(`Date: ${invoice.invoiceDate.toLocaleDateString()}`);
        doc.text(`Due Date: ${invoice.dueDate.toLocaleDateString()}`).moveDown();

        // Customer Info
        doc.fontSize(14).text('Bill To:', { underline: true });
        doc.fontSize(12).text(invoice.customer.customerName || 'N/A');
        if (invoice.customer.companyName) doc.text(invoice.customer.companyName);
        if (invoice.customer.address) doc.text(invoice.customer.address);
        const cityLine = [invoice.customer.city, invoice.customer.state, invoice.customer.pincode].filter(Boolean).join(', ');
        if (cityLine) doc.text(cityLine);
        doc.moveDown();

        // Items
        doc.fontSize(14).text('Items:', { underline: true }).moveDown();
        let y = doc.y;
        doc.fontSize(10).text('Product', 50, y).text('Qty', 300, y).text('Price', 400, y).text('Total', 500, y);
        doc.moveTo(50, y + 15).lineTo(550, y + 15).stroke();
        
        y += 25;
        invoice.order.products.forEach(item => {
            const prodName = item.product ? item.product.productName : 'Unknown Product';
            const total = item.quantity * item.unitPrice;
            doc.text(prodName, 50, y).text(item.quantity.toString(), 300, y).text(`Rs ${item.unitPrice}`, 400, y).text(`Rs ${total}`, 500, y);
            y += 20;
        });

        doc.moveTo(50, y + 10).lineTo(550, y + 10).stroke();
        y += 25;

        // Totals
        doc.fontSize(12).text(`Subtotal: Rs ${invoice.subTotal}`, 400, y);
        doc.text(`Discount: Rs ${invoice.discount || 0}`, 400, y + 20);
        doc.text(`GST: Rs ${invoice.gst || 0}`, 400, y + 40);
        doc.fontSize(14).text(`Grand Total: Rs ${invoice.grandTotal}`, 400, y + 65, { bold: true });

        doc.end();
    } catch (error) {
        if (!res.headersSent) res.status(500).json({ message: error.message });
    }
};

exports.emailInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ _id: req.params.id, createdBy: req.user._id }).populate('customer');
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        if (!invoice.customer.email) return res.status(400).json({ message: 'Customer has no email address' });

        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'mario.runte58@ethereal.email',
                pass: 'wWjR33WcE4kQ4MbxR4'
            }
        });

        await transporter.sendMail({
            from: '"Universal ERP" <billing@universal-erp.com>',
            to: invoice.customer.email,
            subject: `Invoice ${invoice.invoiceNumber} from Universal ERP`,
            text: `Dear ${invoice.customer.customerName},\n\nPlease find your invoice ${invoice.invoiceNumber} for Rs ${invoice.grandTotal}.\n\nThank you for your business!`
        });

        res.json({ message: 'Invoice emailed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
