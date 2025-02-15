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
 await db.collection('payments').deleteMany({});
 await closeDB();
});

beforeEach(async () => {
 await db.collection('payments').deleteMany({});
});

afterEach(() => {
 // Log any errors that occurred during the test
 console.log('Test completed');
});

describe('Payment Routes', () => {
 describe('POST /api/payments', () => {
   it('should create a new payment', async () => {
     const response = await request(app)
       .post('/api/payments')
       .send(testPayment)
       .expect(201)
       .catch(error => {
         console.log('Response:', error.response.body);
         throw error;
       });

     expect(response.body.amount).toBe(testPayment.amount);
     expect(response.body._id).toBeTruthy();

     const payment = await db.collection('payments').findOne({
       _id: new ObjectId(response.body._id)
     });
     expect(payment).toBeTruthy();
   });
 });

 describe('GET /api/payments', () => {
   it('should get all payments', async () => {
     // Create test payments
     await db.collection('payments').insertMany([
       { amount: "200" },
       { amount: "300" }
     ]);

     const response = await request(app)
       .get('/api/payments')
       .expect(200)
       .catch(error => {
         console.log('Response:', error.response.body);
         throw error;
       });

     expect(response.body).toHaveLength(2);
   });
 });

 describe('GET /api/payments/:id', () => {
   it('should get a single payment', async () => {
     const inserted = await db.collection('payments').insertOne(testPayment);
     
     const response = await request(app)
       .get(`/api/payments/${inserted.insertedId}`)
       .expect(200)
       .catch(error => {
         console.log('Response:', error.response.body);
         throw error;
       });

     expect(response.body.amount).toBe(testPayment.amount);
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
     const inserted = await db.collection('payments').insertOne(testPayment);
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
     const inserted = await db.collection('payments').insertOne(testPayment);

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