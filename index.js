const express = require('express');
const app = express();
const PORT = process.env.PORT || 30002;

app.get('/', (req, res) => {
  res.send('Hello, world!');
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
