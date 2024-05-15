const express = require("express");
const router = express.Router();
const { getAllPosts, getPostById, getPostByAuthor, getPostByCategory, addPost, deletePost, updatePost } = require("./post.controllers.js");
const { authenticateToken } = require("../middlewares/auth.js");


router.get("/", getAllPosts);

router.get("/:postId", getPostById);

router.get("/author/:authorId", getPostByAuthor);

router.get("/category/:categoryId", getPostByCategory);

router.post("/", authenticateToken, addPost);

router.delete('/:postId', authenticateToken, deletePost);

router.put('/:postId', authenticateToken, updatePost);

module.exports = router;