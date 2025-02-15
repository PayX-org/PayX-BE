const request = require('supertest');
const { app, stopServer } = require('../index');

describe('API Tests', () => {
  let server;

  beforeAll((done) => {
    server = app.listen(3001, () => done());
  });

  afterAll((done) => {
    server.close(() => {
      stopServer(); // Ensure process exits
      done();
    });
  });

  test('GET / should return 200', async () => {
    const response = await request(server).get('/');
    expect(response.status).toBe(200);
  });
});
