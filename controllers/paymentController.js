const { ObjectId } = require('mongodb');
const { connectDB } = require('../config/db');

const createPayment = async (req, res) => {
  try {
    const db = await connectDB();
    const paymentData = {
      amount: req.body.amount,
      createdAt: new Date()  // Add a timestamp
    };

    const result = await db.collection('payments').insertOne(paymentData);
    
    // Fetch the inserted document to ensure it exists
    const insertedPayment = await db.collection('payments').findOne({
      _id: result.insertedId
    });

    if (!insertedPayment) {
      throw new Error('Payment was not created successfully');
    }

    res.status(201).json(insertedPayment);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { createPayment };