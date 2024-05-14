const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, addUser, deleteUser, updateUser } = require("../users/user.controllers.js");
const fileUpload = require("../middlewares/fileUpload");
const { authenticateToken } = require("../middlewares/auth.js");


router.get("/", getAllUsers);

router.get("/:userId", getUserById);

router.post("/", authenticateToken, fileUpload.single("image"), addUser);

router.delete('/:userId', authenticateToken, deleteUser);

router.put('/:userId', authenticateToken, updateUser);

module.exports = router;