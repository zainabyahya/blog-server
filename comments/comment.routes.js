const express = require("express");
const router = express.Router();
const { getAllComments, getCommentsByPost, addComment, deleteComment } = require("./comment.controllers.js");
const { authenticateToken } = require("../middlewares/auth.js");


router.get("/", getAllComments);

router.get("/post/:postId", getCommentsByPost);

router.post("/", authenticateToken, addComment);

router.delete('/:commentId', authenticateToken, deleteComment);


module.exports = router;