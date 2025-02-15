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
  // Uncomment if you want to clear test data: 
  // await db.collection('payments').deleteMany({});
  await closeDB();
});

/*
beforeEach(async () => {
  await db.collection('payments').deleteMany({});
});
*/

afterEach(() => {
  // Log that the test completed
  console.log('Test completed');
});

describe('Payment Routes', () => {
  describe('POST /api/payments', () => {
    it('should create a new payment with createdAt field', async () => {
      const response = await request(app)
        .post('/api/payments')
        .send({ ...testPayment })  // fresh copy to avoid duplicate _id
        .expect(201)
        .catch(error => {
          console.log('Response:', error.response.body);
          throw error;
        });

      expect(response.body.amount).toBe(testPayment.amount);
      expect(response.body._id).toBeTruthy();
      expect(response.body.createdAt).toBeTruthy(); // Check for createdAt field

      const payment = await db.collection('payments').findOne({
        _id: new ObjectId(response.body._id)
      });
      expect(payment).toBeTruthy();
    });
  });

  describe('GET /api/payments', () => {
    it('should get all test payments with createdAt field', async () => {
      // Insert two test payments with createdAt and a distinguishing field
      await db.collection('payments').insertMany([
        { ...testPayment, createdAt: new Date(), testRun: true },
        { amount: "300", createdAt: new Date(), testRun: true }
      ]);

      const response = await request(app)
        .get('/api/payments')
        .expect(200)
        .catch(error => {
          console.log('Response:', error.response.body);
          throw error;
        });

      // Filter for payments inserted in this test run
      const testPayments = response.body.filter(payment => payment.testRun);
      expect(testPayments).toHaveLength(2);
      
      // Optionally, verify that each test payment has a createdAt field
      testPayments.forEach(payment => {
        expect(payment.createdAt).toBeTruthy();
      });
    });
  });

  describe('GET /api/payments/:id', () => {
    it('should get a single payment with createdAt field', async () => {
      // Insert a fresh test payment including a createdAt field
      const inserted = await db.collection('payments').insertOne({ ...testPayment, createdAt: new Date() });
      
      const response = await request(app)
        .get(`/api/payments/${inserted.insertedId}`)
        .expect(200)
        .catch(error => {
          console.log('Response:', error.response.body);
          throw error;
        });

      expect(response.body.amount).toBe(testPayment.amount);
      expect(response.body.createdAt).toBeTruthy();
    });

    it('should return 404 for non-existent payment', async () => {
      const fakeId = new ObjectId();
      await request(app)
        .get(`/api/payments/${fakeId}`)
        .expect(404)
        .catch(error => {
          console.log('Response:', error.response.body);
          throw error;
        });
    });
  });

  describe('PUT /api/payments/:id', () => {
    it('should update a payment', async () => {
      const inserted = await db.collection('payments').insertOne({ ...testPayment, createdAt: new Date() });
      const updatedAmount = "300";

      const response = await request(app)
        .put(`/api/payments/${inserted.insertedId}`)
        .send({ amount: updatedAmount })
        .expect(200)
        .catch(error => {
          console.log('Response:', error.response.body);
          throw error;
        });

      expect(response.body.amount).toBe(updatedAmount);
      // Optionally, you could also verify the presence of an updatedAt field
      // expect(response.body.updatedAt).toBeTruthy();
    });

    it('should return 404 for non-existent payment', async () => {
      const fakeId = new ObjectId();
      await request(app)
        .put(`/api/payments/${fakeId}`)
        .send({ amount: "300" })
        .expect(404)
        .catch(error => {
          console.log('Response:', error.response.body);
          throw error;
        });
    });
  });

  describe('DELETE /api/payments/:id', () => {
    it('should delete a payment', async () => {
      const inserted = await db.collection('payments').insertOne({ ...testPayment, createdAt: new Date() });

      await request(app)
        .delete(`/api/payments/${inserted.insertedId}`)
        .expect(200)
        .catch(error => {
          console.log('Response:', error.response.body);
          throw error;
        });

      const payment = await db.collection('payments').findOne({
        _id: inserted.insertedId
      });
      expect(payment).toBeNull();
    });

    it('should return 404 for non-existent payment', async () => {
      const fakeId = new ObjectId();
      await request(app)
        .delete(`/api/payments/${fakeId}`)
        .expect(404)
        .catch(error => {
          console.log('Response:', error.response.body);
          throw error;
        });
    });
  });
});
