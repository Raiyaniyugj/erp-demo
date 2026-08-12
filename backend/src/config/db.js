const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        return;
    }
    try {
        const uri = process.env.MONGODB_URI || 'mongodb+srv://universal-erp:jRWzGbLY4qh6qk4m@cluster0.klxk7yc.mongodb.net/universal-erp';
        const db = await mongoose.connect(uri);
        isConnected = db.connections[0].readyState === 1;
        console.log(`MongoDB Connected: ${db.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
    }
};
module.exports = connectDB;
