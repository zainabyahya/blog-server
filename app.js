const dotenv = require("dotenv");
dotenv.config();

const path = require("path");
const express = require('express');
const app = express();
const cors = require('cors');


const connectDB = require("./database.js");
connectDB();

const postRoutes = require("./posts/post.routes.js");
const userRoutes = require("./users/user.routes.js");
const categoryRoutes = require("./categories/category.routes.js");
const ActivityRoutes = require("./activities/activity.routes.js");
const authRoutes = require("./auth/auth.routes.js");
// const errorHandling = require("./middlewares/errorHandling.js");

const staticPath = path.join(path.dirname(""), "static/images");

app.use(express.json());
app.use(cors());
app.use("/posts", postRoutes);
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/activities", ActivityRoutes);
app.use("/auth", authRoutes);
app.use("/images", express.static(staticPath));

// app.use(errorHandling);

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