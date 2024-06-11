const Post = require("../models/Post");
const path = require("path");
const fs = require("fs");
const Category = require("../models/Category");
const Bookmark = require("../models/Bookmark");

const checkTags = async (tags) => {
    // check if category exist, if not, add it
    const existingCategories = await Category.find({ name: { $in: tags } });
    const existingCategoryNames = existingCategories.map(cat => cat.name);
    const newCategoryNames = tags.filter(tag => !existingCategoryNames.includes(tag));
    const newCategories = await Category.insertMany(newCategoryNames.map(name => ({ name })));
    const allCategories = [...existingCategories, ...newCategories];
    const categoriesIds = allCategories.map(category => ({ _id: category._id }));

    return categoriesIds;
}

const getAllPosts = async (req, res, next) => {
    try {
        const allPosts = await Post.find().populate('tags').populate('author');
        res.status(200).json({ allPosts });
    } catch (error) {
        next(error);
    }
};

const getPostById = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const foundPost = await Post.findById(postId).populate('tags').populate('author');
        res.status(200).json({ foundPost });
    } catch (error) {
        next(error);
    }
};

const getPostByAuthor = async (req, res, next) => {
    try {
        const { authorId } = req.params;
        console.log("🚀 ~ getPostByAuthor ~ authorId:", authorId)
        const foundPosts = await Post.find({ author: authorId }).populate('tags');
        console.log("🚀 ~ getPostByAuthor ~ foundPosts:", foundPosts)
        res.status(200).json({ foundPosts });
    } catch (error) {
        next(error);
    }
};

const getPostByCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const foundPosts = await Post.find({ tags: categoryId }).populate('tags');
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

        const categoriesIds = await checkTags(tags);

        const newPostData = {
            ...req.body,
            author: req.user.userId,
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



const deletePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const userId = req.user.userId;
        const checkPost = await Post.findById(postId);
        if (userId !== checkPost.author.toString()) {
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
        await Bookmark.updateMany(
            { posts: postId },
            { $pull: { posts: postId } }
        );

        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

const updatePost = async (req, res, next) => {
    try {
        let imageUrl = "images/";
        let newPostData = {};
        const postId = req.params.postId;
        const userId = req.user.userId;
        console.log("🚀 ~ updatePost ~ userId:", userId)
        const checkPost = await Post.findById(postId);
        console.log("🚀 ~ updatePost ~ checkPost:", checkPost)
        if (userId !== checkPost.author.toString()) {
            return res.status(400).json({
                message: `You don't have permission to edit this post`,
            });
        }
        const tags = req.body.tags.join(' ').split(' ').filter(tag => tag.trim() !== '');
        const categoriesIds = await checkTags(tags);

        if (req.file) {
            const imageFile = req.file;
            console.log(imageFile);
            imageUrl += imageFile.filename;
            newPostData = {
                ...req.body,
                image: imageUrl,
                tags: categoriesIds,
                dateEdited: Date.now()
            }
        } else {
            newPostData = {
                ...req.body,
                tags: categoriesIds,
                dateEdited: Date.now()
            }
        }
        console.log("🚀 ~ updatePost ~ newPostData:", newPostData)

        const updatedPost = await Post.findByIdAndUpdate(postId, newPostData, { new: true });
        console.log("🚀 ~ updatePost ~ updatedPost:", updatedPost)
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