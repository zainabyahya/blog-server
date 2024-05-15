const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const verifyAccessToken = async (token) => {
    try {
        const decodedData = jwt.verify(token, process.env.SECRET_KEY);
        return { success: true, data: decodedData };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Please log in to proceed" });
        }

        const result = await verifyAccessToken(token);
        if (!result.success) {
            return res.status(403).json({ error: result.error });
        }
        if (Date.now() * 1000 > result.exp) {
            return res.sendStatus(401);
        }
        req.user = result.data;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { authenticateToken };