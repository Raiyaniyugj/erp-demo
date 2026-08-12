require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function createTestUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');

        // Check if test user already exists
        const existing = await usersCollection.findOne({ email: 'testuser@demo.com' });
        if (existing) {
            console.log('\n=== TEST USER ALREADY EXISTS ===');
            console.log('ID:    ', existing._id.toString());
            console.log('Name:  ', existing.name);
            console.log('Email: ', existing.email);
            console.log('Role:  ', existing.role);
            console.log('================================\n');
            await mongoose.disconnect();
            return;
        }

        // Hash password manually
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('test1234', salt);

        // Insert test user directly
        const result = await usersCollection.insertOne({
            name: 'Test User',
            email: 'testuser@demo.com',
            password: hashedPassword,
            authProvider: 'local',
            role: 'Super Admin',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log('\n=== TEST USER CREATED ===');
        console.log('ID:       ', result.insertedId.toString());
        console.log('Name:     ', 'Test User');
        console.log('Email:    ', 'testuser@demo.com');
        console.log('Password: ', 'test1234');
        console.log('Role:     ', 'Super Admin');
        console.log('=========================\n');

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error.message);
        await mongoose.disconnect();
        process.exit(1);
    }
}

createTestUser();
