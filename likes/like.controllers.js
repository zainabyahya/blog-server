const Like = require("../models/Like.js");
const Post = require("../models/Post.js");



const getAllLikes = async (req, res, next) => {
    try {
        const allLikes = await Like.find();
        res.status(200).json({ allLikes });
    } catch (error) {
        next(error);
    }
};

const handleLike = async (req, res, next) => {
    try {
        const { postId, userId } = req.body;
        console.log("🚀 ~ handleLike ~ req.body:", req.body)
        let existingLike = await Like.findOne({ post: postId, user: userId });
        console.log("🚀 ~ addLike ~ like:", existingLike)

        if (existingLike) {
            await Like.findByIdAndDelete(existingLike._id);
            const updatedPost = await Post.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } }, { new: true });
            res.status(201).json({ updatedPost });

        } else {
            existingLike = new Like({ user: userId, post: postId });
            await existingLike.save();
            const updatedPost = await Post.findByIdAndUpdate(postId, { $inc: { likeCount: +1 } }, { new: true });

            res.status(201).json({ updatedPost });
        }

    } catch (error) {
        next(error);
    }
};


const deleteLike = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { postId } = req.params;

        const like = await Like.findOne({ post: postId });

        if (like && like.users.includes(userId)) {
            like.users.pull(userId);
            await like.save();

            await Post.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } });

            if (like.users.length === 0) {
                await Like.findByIdAndDelete(like._id);
            }

            const updatedPost = await Post.findById(postId);
            res.status(200).json({ updatedPost });
        } else {
            res.status(404).json({ message: "Like not found" });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllLikes, handleLike, deleteLike };