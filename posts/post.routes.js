const express = require("express");
const router = express.Router();
const { getAllPosts, getPostById, getPostByAuthor, addPost, deletePost, updatePost } = require("./post.controllers.js");
const { authenticateToken } = require("../middlewares/auth.js");


router.get("/", getAllPosts);

router.get("/:postId", authenticateToken, getPostById);

router.get("/author/:authorId", getPostByAuthor);

router.post("/", authenticateToken, addPost);

router.delete('/:postId', authenticateToken, deletePost);

router.put('/:postId', authenticateToken, updatePost);

module.exports = router;