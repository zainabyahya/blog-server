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
        console.log("🚀 ~ getUserById ~ userId:", userId)
        const foundUser = await User.findById(userId);
        console.log("🚀 ~ getUserById ~ foundUser:", foundUser)
        res.status(200).json({ foundUser });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { actingUserId } = req.user.userId;
        if (userId !== actingUserId) {
            return res.status(400).json({
                message: `You don't have permission to delete this user`,
            });
        }
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
        const { actingUserId } = req.user.userId;
        if (userId !== actingUserId) {
            return res.status(400).json({
                message: `You don't have permission to edit this user`,
            });
        }
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
        if (!updatedUser)
            return res.status(400).json({
                message: `Oops, it seems like the user you're looking for is not there`,
            });
        res.status(201).json({ updatedUser });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllUsers, getUserById, deleteUser, updateUser };