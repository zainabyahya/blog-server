const Post = require("../models/Post");
const path = require("path");
const fs = require("fs");
const Category = require("../models/Category");

const getAllPosts = async (req, res, next) => {
    try {
        const allPosts = await Post.find();
        res.status(200).json({ allPosts });
    } catch (error) {
        next(error);
    }
};

const getPostById = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const foundPost = await Post.findById(postId);
        res.status(200).json({ foundPost });
    } catch (error) {
        next(error);
    }
};

const getPostByAuthor = async (req, res, next) => {
    try {
        const { authorId } = req.params;
        const foundPosts = await Post.findById({ author: authorId });
        res.status(200).json({ foundPosts });
    } catch (error) {
        next(error);
    }
};

const getPostByCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const foundPosts = await Post.findById({ tag: categoryId });
        res.status(200).json({ foundPosts });
    } catch (error) {
        next(error);
    }
};

const addPost = async (req, res, next) => {
    try {
        const imageFile = req.file;
        const imageUrl = "images/" + imageFile?.filename;
        const tags = req.body.tags.split(' ').filter(tag => tag.trim() !== '');

        // check if category exist, if not, add it
        const existingCategories = await Category.find({ name: { $in: tags } });
        const existingCategoryNames = existingCategories.map(cat => cat.name);
        const newCategoryNames = tags.filter(tag => !existingCategoryNames.includes(tag));
        const newCategories = await Category.insertMany(newCategoryNames.map(name => ({ name })));
        const allCategories = [...existingCategories, ...newCategories];
        const categoriesIds = allCategories.map(category => ({ _id: category._id }));

        const newPostData = {
            ...req.body,
            author: req.user.id,
            dateCreated: Date.now(),
            image: imageUrl,
            tags: categoriesIds,
        };

        const newPost = await Post.create(newPostData);

        res.status(201).json({ newPost });
    } catch (error) {
        next(error);
    }
};

module.exports = addPost;


const deletePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { userId } = req.user.userId;
        const checkPost = await Post.findByIdAndDelete(postId);
        if (userId !== checkPost.author) {
            return res.status(400).json({
                message: `You don't have permission to delete this post`,
            });
        }
        const foundPost = await Post.findByIdAndDelete(postId);
        if (!foundPost) {
            return res.status(400).json({
                message: `Oops, it seems like the post you're looking for is not there`,
            });
        }
        if (foundPost.image) {
            const imageName = foundPost.image.replace(/^images\//, "");
            const staticPath = path.join(path.dirname(""), "static/images");
            const imagePath = path.join(staticPath, imageName);

            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        return res.status(500).json({ error: "Error deleting post image" });
                    }
                });
            }
        }
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

const updatePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { userId } = req.user.userId;
        const checkPost = await Post.findById(postId);
        if (userId !== checkPost.author) {
            return res.status(400).json({
                message: `You don't have permission to edit this post`,
            });
        }
        const updatedPost = await Post.findByIdAndUpdate(postId, req.body, { new: true });
        if (!updatedPost)
            return res.status(400).json({
                message: `Oops, it seems like the post you're looking for is not there`,
            });
        res.status(201).json({ updatedPost });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllPosts, getPostById, getPostByAuthor, getPostByCategory, addPost, deletePost, updatePost };