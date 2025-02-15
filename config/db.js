const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://PayXDBusername:vioZmZq9e69Hhb4r@cluster1.lc1wr.mongodb.net/?retryWrites=true&w=majority&appName=cluster1";

let db;
let client;

async function connectDB() {
  try {
    if (db) return db; // Reuse existing connection
    
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB'); // Debug log
    
    db = client.db('PayX-db');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

async function closeDB() {
  try {
    if (client) {
      await client.close();
      console.log('Disconnected from MongoDB'); // Debug log
      db = null;
      client = null;
    }
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
}

module.exports = { connectDB, closeDB };