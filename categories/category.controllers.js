const Category = require("../models/Category.js");


const getAllCategories = async (req, res, next) => {
    try {
        const allCategories = await Category.find().populate("users");
        res.status(200).json({ allCategories });
    } catch (error) {
        next(error);
    }
};

const getCategoryById = async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const foundCategory = await Category.findById(categoryId);
        res.status(200).json({ foundCategory });
    } catch (error) {
        next(error);
    }
};

const addCategory = async (req, res, next) => {
    try {
        const newCategoryData = { ...req.body };
        const newCategory = await Category.create(newCategoryData);
        res.status(201).json({ newCategory });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllCategories, getCategoryById, addCategory };