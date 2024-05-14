const express = require("express");
const router = express.Router();
const { getAllCategories, getCategoryById, addCategory, deleteCategory, updateCategory } = require("./category.controllers.js");
const fileUpload = require("../middlewares/fileUpload");


router.get("/", getAllCategories);

router.get("/:categoryId", getCategoryById);

router.post("/", fileUpload.single("image"), addCategory);

router.delete('/:categoryId', deleteCategory);

router.put('/:categoryId', updateCategory);

module.exports = router;