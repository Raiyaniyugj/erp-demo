const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = 'mongodb+srv://universal-erp:jRWzGbLY4qh6qk4m@cluster0.klxk7yc.mongodb.net/universal-erp';
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        // Do not process.exit(1) here so serverless function can still serve the demo login bypass
    }
};
module.exports = connectDB;
