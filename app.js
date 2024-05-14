const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const app = express();

const connectDB = require("./database.js");
connectDB();

app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.use('*', (req, res) => {
    res.status(404).json({ "message": "Page does not exist. Try again!" });
});

const port = 8000;
app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});