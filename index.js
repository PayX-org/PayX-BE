const express = require('express');
const app = express();
const PORT = process.env.PORT || 30002;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = server;

