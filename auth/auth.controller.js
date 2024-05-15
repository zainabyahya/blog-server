const User = require("../models/User.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (userCredentials) => {
    const payload = {
        userId: userCredentials._id,
        email: userCredentials.email,
        firstName: userCredentials.firstName,
        lastName: userCredentials.lastName,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: Date.now() + 360,
    });
    return token;
};

const login = async (req, res, next) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;

        const foundUser = await User.findOne({ email: email });

        if (!foundUser) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, foundUser.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: foundUser._id, email: foundUser.email },
            process.env.SECRET_KEY
        );

        res.status(201).json(token);
    } catch (error) {
        next(error);
    }
};

const signUp = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        const imageFile = req.file;
        const imageUrl = "images/" + imageFile.filename;

        const newUserData = {
            ...req.body,
            image: imageUrl,
        };
        const newUser = await User.create(newUserData);
        const generatedToken = generateToken(newUser);
        res.status(201).json({ generatedToken });
    } catch (error) {
        next(error);
    }

};


module.exports = { login, signUp };