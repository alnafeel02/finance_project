const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  {
    name: 'Personal Loan',
    interestRate: 12,
    maxTenure: 5,
    limit: 50000,
    status: 'Active',
    description: 'Quick personal financing for all your needs.'
  },
  {
    name: 'Business Loan',
    interestRate: 10.5,
    maxTenure: 7,
    limit: 250000,
    status: 'Active',
    description: 'Grow your business with our flexible capital solutions.'
  },
  {
    name: 'Home Loan',
    interestRate: 8.5,
    maxTenure: 25,
    limit: 1000000,
    status: 'Active',
    description: 'Building your dream home is easier than ever.'
  },
  {
    name: 'Education Loan',
    interestRate: 9,
    maxTenure: 10,
    limit: 100000,
    status: 'Active',
    description: 'Invest in your future with specialized student loans.'
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products to avoid duplicates during seeding
    await Product.deleteMany();
    console.log('Cleared existing products');

    await Product.insertMany(products);
    console.log('Initial products seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding products:', err);
    process.exit(1);
  }
};

seedProducts();
