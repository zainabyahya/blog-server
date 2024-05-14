const path = require("path");
const fs = require("fs");
const User = require("../models/User.js");

const getAllUsers = async (req, res, next) => {
    try {
        const allUsers = await User.find();
        res.status(200).json({ allUsers });
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const foundUser = await User.findByuserId(userId);
        res.status(200).json({ foundUser });
    } catch (error) {
        next(error);
    }
};

const addUser = async (req, res, next) => {
    try {
        const imageFile = req.file;
        console.log(imageFile);
        const imageUrl = "images/" + imageFile.filename;

        const newUserData = {
            ...req.body,
            image: imageUrl,
        };
        const newUser = await User.create(newUserData);
        res.status(201).json({ newUser });
    } catch (error) {
        next(error);
    }
};
const deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const foundUser = await User.findByuserIdAndDelete(userId);
        if (!foundUser) {
            return res.status(400).json({
                message: `Oops, it seems like the user you're looking for is not there`,
            });
        }
        if (foundUser.image) {
            const imageName = foundUser.image.replace(/^images\//, "");
            const staticPath = path.join(path.dirname(""), "static/images");
            const imagePath = path.join(staticPath, imageName);

            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        return res.status(500).json({ error: "Error deleting user image" });
                    }
                });
            }
        }
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};
const updateUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const updatedUser = await User.findByuserIdAndUpdate(userId, req.body, { new: true });
        if (!updatedUser)
            return res.status(400).json({
                message: `Oops, it seems like the user you're looking for is not there`,
            });
        res.status(201).json({ updatedUser });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllUsers, getUserById, addUser, deleteUser, updateUser };