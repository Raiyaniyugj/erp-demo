const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        let uri = process.env.MONGODB_URI || 'mongodb+srv://raiyaniyug5457_db_user:ehv9iMefjVk7GD7B@ac-tyizkfz.klxk7yc.mongodb.net/universal-erp?retryWrites=true&w=majority';
        if (uri.includes('directConnection=true')) {
            uri = 'mongodb+srv://raiyaniyug5457_db_user:ehv9iMefjVk7GD7B@ac-tyizkfz.klxk7yc.mongodb.net/universal-erp?retryWrites=true&w=majority';
        }
        
        cached.promise = mongoose.connect(uri, {
            bufferCommands: false
        }).then((mongoose) => {
            console.log(`MongoDB Connected: ${mongoose.connection.host}`);
            return mongoose;
        }).catch(err => {
            console.error(`MongoDB Connection Error: ${err.message}`);
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
};

module.exports = connectDB;
