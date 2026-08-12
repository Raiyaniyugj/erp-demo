require('dotenv').config();
const mongoose = require('mongoose');

async function testQuotation() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const jwt = require('jsonwebtoken');
        const DEMO_ADMIN_ID = new mongoose.Types.ObjectId('000000000000000000000001');

        // Simulate what the controller does
        const Product = require('../src/models/Product');
        const Customer = require('../src/models/Customer');
        const Quotation = require('../src/models/Quotation');

        // Get a customer and product
        const customers = await Customer.find().limit(1);
        const products = await Product.find().limit(1);

        console.log('Customers found:', customers.length);
        console.log('Products found:', products.length);

        if (customers.length === 0 || products.length === 0) {
            console.log('No customers or products to test with. Create some first.');
            await mongoose.disconnect();
            return;
        }

        const customer = customers[0];
        const product = products[0];

        console.log('Using customer:', customer.customerName, customer._id);
        console.log('Using product:', product.productName, product._id, 'GST:', product.gstPercentage);

        // Calculate totals like the controller does
        const quantity = 2;
        const unitPrice = product.sellingPrice;
        const lineTotal = quantity * unitPrice;
        const subTotal = lineTotal;
        const gstTotal = lineTotal * (product.gstPercentage / 100);
        const grandTotal = subTotal + gstTotal;

        console.log('SubTotal:', subTotal, 'GST:', gstTotal, 'GrandTotal:', grandTotal);

        // Create the quotation
        const quotation = new Quotation({
            quotationNumber: 'Q-TEST-' + Date.now(),
            customer: customer._id,
            products: [{ product: product._id, quantity, unitPrice }],
            discount: 0,
            subTotal,
            gst: gstTotal,
            grandTotal,
            validTill: new Date('2026-12-31'),
            remarks: 'Test quotation',
            createdBy: DEMO_ADMIN_ID
        });

        const saved = await quotation.save();
        console.log('\n=== QUOTATION CREATED SUCCESSFULLY ===');
        console.log('ID:', saved._id);
        console.log('Number:', saved.quotationNumber);
        console.log('Grand Total:', saved.grandTotal);
        console.log('Status:', saved.status);
        console.log('CreatedBy:', saved.createdBy);
        console.log('=======================================\n');

        await mongoose.disconnect();
    } catch (error) {
        console.error('ERROR:', error.message);
        await mongoose.disconnect();
        process.exit(1);
    }
}

testQuotation();
