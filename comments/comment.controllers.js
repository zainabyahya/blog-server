const Comment = require("../models/Comment.js");
const Post = require("../models/Post.js");

const getAllComments = async (req, res, next) => {
    try {
        const allComments = await Comment.find();
        res.status(200).json({ allComments });
    } catch (error) {
        next(error);
    }
};

const getCommentsByPost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const foundComments = await Comment.find({ post: postId }).populate("user");
        res.status(200).json({ foundComments });
    } catch (error) {
        next(error);
    }
};

const addComment = async (req, res, next) => {
    try {
        const postId = req.body.post;
        const newCommentData = {
            ...req.body,
            user: req.user.userId,
        };

        const newComment = await Comment.create(newCommentData);
        await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });

        res.status(201).json({ newComment });
    } catch (error) {
        next(error);
    }
}
const deleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;
        const { userId } = req.user.userId;
        const checkComment = await Comment.findById(commentId);

        if (userId != checkComment.user.toString()) {
            return res.status(400).json({
                message: `You don't have permission to delete this Comment`,
            });
        }

        const foundComment = await Comment.findByIdAndDelete(commentId);

        if (!foundComment) {
            return res.status(400).json({
                message: `Oops, it seems like the Comment you're looking for is not there`,
            });
        }
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllComments, getCommentsByPost, addComment, deleteComment }; 