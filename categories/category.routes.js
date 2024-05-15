const express = require("express");
const router = express.Router();
const { getAllCategories, getCategoryById, addCategory } = require("./category.controllers.js");
const { authenticateToken } = require("../middlewares/auth.js");

router.get("/", getAllCategories);

router.get("/:categoryId", getCategoryById);

router.post("/", authenticateToken, addCategory);

module.exports = router;