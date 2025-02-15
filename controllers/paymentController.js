const { ObjectId } = require('mongodb');
const { connectDB } = require('../config/db');

const createPayment = async (req, res) => {
  try {
    const db = await connectDB();
    const paymentData = {
      amount: req.body.amount,
      createdAt: new Date()
    };
    const result = await db.collection('payments').insertOne(paymentData);
    const insertedPayment = await db.collection('payments').findOne({
      _id: result.insertedId
    });
    res.status(201).json(insertedPayment);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getPayment = async (req, res) => {
  try {
    const db = await connectDB();
    const payment = await db.collection('payments').findOne({
      _id: new ObjectId(req.params.id)
    });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    console.error('Error getting payment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updatePayment = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection('payments').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { amount: req.body.amount, updatedAt: new Date() } },
      { returnDocument: 'after' } // This is the correct option for MongoDB Node.js driver v4+
    );
    
    if (!result) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(result);
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deletePayment = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection('payments').findOneAndDelete({
      _id: new ObjectId(req.params.id)
    });
    
    if (!result) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const db = await connectDB();
    const payments = await db.collection('payments').find().toArray();
    res.json(payments);
  } catch (error) {
    console.error('Error getting all payments:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createPayment,
  getPayment,
  updatePayment,
  deletePayment,
  getAllPayments
};