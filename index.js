const express = require('express');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const PORT = process.env.PORT || 30002;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use('/api/payments', paymentRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

let server;

// Only start the server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
}

// Gracefully stop the server
const stopServer = () => {
  if (server) {
    server.close(() => {
      console.log('Server stopped');
      process.exit(0);
    });
  }
};

process.on('SIGTERM', stopServer);
process.on('SIGINT', stopServer);

module.exports = { app, stopServer };
