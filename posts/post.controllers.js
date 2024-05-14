const Post = require("../models/Post");
const path = require("path");
const fs = require("fs");


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
        const foundPost = await Post.findById({ author: authorId });
        res.status(200).json({ foundPost });
    } catch (error) {
        next(error);
    }
};

const addPost = async (req, res, next) => {
    try {
        const imageFile = req.file;
        console.log(imageFile);
        const imageUrl = "images/" + imageFile.filename;

        const newPostData = {
            ...req.body,
            image: imageUrl,
        };
        const newPost = await Post.create(newPostData);
        res.status(201).json({ newPost });
    } catch (error) {
        next(error);
    }
};

const deletePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
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

module.exports = { getAllPosts, getPostById, getPostByAuthor, addPost, deletePost, updatePost };