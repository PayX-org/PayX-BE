const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

// Your routes and middleware
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

// Export the server for testing
module.exports = server;

// Gracefully stop the server
const stopServer = () => {
  server.close(() => {
    console.log('Server stopped');
    process.exit(0); // Exit the process
  });
};

// Use this in your tests to stop the server
if (process.env.NODE_ENV === 'test') {
  setTimeout(() => {
    stopServer();
  }, 5000); // Stop the server after 5 seconds (for example)
}
