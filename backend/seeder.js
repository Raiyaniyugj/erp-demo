const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Customer = require('./src/models/Customer');
const Product = require('./src/models/Product');
const connectDB = require('./src/config/db');

dotenv.config();

const importData = async () => {
    try {
        await connectDB();
        await User.deleteMany();
        await Customer.deleteMany();
        await Product.deleteMany();

        const users = await User.create([
            { name: 'Admin User', email: 'admin@erp.com', password: 'password123', role: 'Super Admin' },
            { name: 'Manager User', email: 'manager@erp.com', password: 'password123', role: 'Manager' },
            { name: 'Sales Executive', email: 'sales@erp.com', password: 'password123', role: 'Sales Executive' },
        ]);

        const salesExec = users[2];

        await Customer.create([
            { customerName: 'Rahul Sharma', companyName: 'TechVista Pvt Ltd', gstNumber: '27AABCU9603R1ZM', phoneNumber: '9876543210', email: 'rahul@techvista.com', address: '123 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', customerType: 'B2B', creditLimit: 500000, salesExecutive: salesExec._id },
            { customerName: 'Priya Patel', companyName: 'GreenLeaf Solutions', gstNumber: '24AADCG1234F1ZH', phoneNumber: '9123456789', email: 'priya@greenleaf.com', address: '45 SG Highway', city: 'Ahmedabad', state: 'Gujarat', pincode: '380015', customerType: 'B2B', creditLimit: 300000, salesExecutive: salesExec._id },
            { customerName: 'Amit Kumar', companyName: '', phoneNumber: '8765432109', email: 'amit@gmail.com', address: '78 Ring Road', city: 'Delhi', state: 'Delhi', pincode: '110001', customerType: 'B2C', creditLimit: 50000, salesExecutive: salesExec._id },
            { customerName: 'Sneha Reddy', companyName: 'Reddy Electronics', gstNumber: '36AABCR5678D1ZJ', phoneNumber: '7654321098', email: 'sneha@reddyelectronics.com', address: '12 Banjara Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500034', customerType: 'B2B', creditLimit: 700000, salesExecutive: salesExec._id },
            { customerName: 'Vikram Singh', companyName: 'Singh Traders', gstNumber: '09AABCS9012G1ZK', phoneNumber: '6543210987', email: 'vikram@singhtraders.com', address: '99 Civil Lines', city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226001', customerType: 'B2B', creditLimit: 200000, salesExecutive: salesExec._id },
        ]);

        await Product.create([
            { productName: 'Wireless Mouse', sku: 'WM-001', category: 'Accessories', hsnCode: '8471', purchasePrice: 250, sellingPrice: 499, gstPercentage: 18, unit: 'Pcs', currentStock: 150, minimumStock: 20 },
            { productName: 'Mechanical Keyboard', sku: 'MK-002', category: 'Accessories', hsnCode: '8471', purchasePrice: 1200, sellingPrice: 2499, gstPercentage: 18, unit: 'Pcs', currentStock: 75, minimumStock: 10 },
            { productName: 'USB-C Hub 7-in-1', sku: 'UH-003', category: 'Accessories', hsnCode: '8473', purchasePrice: 800, sellingPrice: 1599, gstPercentage: 18, unit: 'Pcs', currentStock: 5, minimumStock: 15 },
            { productName: '27" 4K Monitor', sku: 'MN-004', category: 'Displays', hsnCode: '8528', purchasePrice: 15000, sellingPrice: 24999, gstPercentage: 18, unit: 'Pcs', currentStock: 30, minimumStock: 5 },
            { productName: 'Laptop Stand Aluminium', sku: 'LS-005', category: 'Accessories', hsnCode: '8473', purchasePrice: 600, sellingPrice: 1299, gstPercentage: 18, unit: 'Pcs', currentStock: 8, minimumStock: 10 },
            { productName: 'Webcam 1080p', sku: 'WC-006', category: 'Peripherals', hsnCode: '8525', purchasePrice: 1500, sellingPrice: 2999, gstPercentage: 18, unit: 'Pcs', currentStock: 45, minimumStock: 10 },
            { productName: 'Noise Cancelling Headphone', sku: 'NH-007', category: 'Audio', hsnCode: '8518', purchasePrice: 3000, sellingPrice: 5999, gstPercentage: 18, unit: 'Pcs', currentStock: 60, minimumStock: 8 },
            { productName: 'Ethernet Cable Cat6 3m', sku: 'EC-008', category: 'Cables', hsnCode: '8544', purchasePrice: 80, sellingPrice: 199, gstPercentage: 18, unit: 'Pcs', currentStock: 3, minimumStock: 50 },
        ]);

        console.log('Data Imported Successfully!');
        console.log('---');
        console.log('Users: admin@erp.com / manager@erp.com / sales@erp.com');
        console.log('Password: password123');
        console.log('Customers: 5 seeded');
        console.log('Products: 8 seeded (3 with low stock)');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
