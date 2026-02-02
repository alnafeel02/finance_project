const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@finance.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit();
    }

    const admin = await User.create({
      name: 'System Admin',
      email: adminEmail,
      password: 'adminpassword123',
      role: 'admin',
      phone: '1234567890',
      address: 'Admin HQ',
      kycStatus: 'verified'
    });

    console.log('Admin account created successfully!');
    console.log('Email: admin@finance.com');
    console.log('Password: adminpassword123');
    process.exit();
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
};

createAdmin();
