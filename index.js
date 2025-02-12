const express = require("express");
const connectDB = require('./config/db');

const app = express();
const PORT = 3001;

connectDB();

// Middleware
app.use(express.json());



app.get("/", (req, res) => {
    res.sendStatus(200);
})


app.listen(PORT, () => {
    console.log(`App listening in port ${PORT}`);
})
