const request = require("supertest");
const { app } = require("../index");
const { connectDB, closeDB } = require("../config/db");
const { ObjectId } = require('mongodb'); 

let db;

const testPayment = {
  amount: "200"
};

beforeAll(async () => {
  db = await connectDB();
});

afterAll(async () => {
  await closeDB();
});

describe('Payment Routes', () => {
  it('should create a new payment', async () => {
    // Clear the collection before test
    await db.collection('payments').deleteMany({});
    
    const response = await request(app)
      .post('/api/payments')
      .send(testPayment)
      .expect(201);

    expect(response.body.amount).toBe(testPayment.amount);
    expect(response.body._id).toBeTruthy();

    console.log('Response from API:', response.body); // Debug log

    // Add a small delay to ensure MongoDB has time to process
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify the payment exists in MongoDB
    const payment = await db.collection('payments').findOne({
      _id: new ObjectId(response.body._id)
    });
    
    console.log('Payment from DB:', payment); // Debug log
    expect(payment).toBeTruthy();
  });
});