const Product = require('../models/Product');
const Inventory = require('../models/Inventory');

exports.getProducts = async (req, res) => {
    try {
        let query = { status: 'Active' };
        if (req.query.search) {
            query.$or = [
                { productName: { $regex: req.query.search, $options: 'i' } },
                { sku: { $regex: req.query.search, $options: 'i' } }
            ];
        }
        if (req.query.category) {
            query.category = req.query.category;
        }

        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        
        if (req.body.currentStock > 0) {
            await Inventory.create({
                product: savedProduct._id,
                type: 'Stock In',
                quantity: req.body.currentStock,
                remarks: 'Initial Stock'
            });
        }
        
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const { Parser } = require('json2csv');
const csv = require('csv-parser');
const fs = require('fs');

exports.exportProducts = async (req, res) => {
    try {
        const products = await Product.find().lean();
        const fields = ['productName', 'sku', 'category', 'description', 'unitPrice', 'minimumStock', 'currentStock'];
        const json2csvParser = new Parser({ fields });
        const csvData = json2csvParser.parse(products);

        res.header('Content-Type', 'text/csv');
        res.attachment('products.csv');
        return res.send(csvData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.importProducts = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                const formatted = results.map(row => ({
                    ...row,
                    unitPrice: Number(row.unitPrice) || 0,
                    minimumStock: Number(row.minimumStock) || 0,
                    currentStock: Number(row.currentStock) || 0,
                }));
                await Product.insertMany(formatted);
                fs.unlinkSync(req.file.path);
                res.status(201).json({ message: `${results.length} products imported successfully` });
            } catch (error) {
                fs.unlinkSync(req.file.path);
                res.status(400).json({ message: error.message });
            }
        });
};
