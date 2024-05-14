const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const app = express();
const cors = require('cors');


const connectDB = require("./database.js");
connectDB();

const postRoutes = require("./posts/post.routes.js");


app.use(express.json());
app.use(cors());
app.use("/posts", postRoutes);



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