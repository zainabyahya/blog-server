const Bookmark = require("../models/Bookmark.js");


const getAllBookmarks = async (req, res, next) => {
    try {
        const allBookmarks = await Bookmark.find().populate("posts");
        res.status(200).json({ allBookmarks });
    } catch (error) {
        next(error);
    }
};

const getBookmarksByUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        console.log("🚀 ~ getBookmarksByUser ~ userId:", userId)
        const userBookmarks = await Bookmark.findOne({ user: userId }).populate('posts');
        console.log("🚀 ~ getBookmarksByUser ~ userBookmarks:", userBookmarks)
        res.status(200).json({ userBookmarks });
    } catch (error) {
        next(error);
    }
};

const handleBookmark = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const postId = req.body.postId;
        console.log("🚀 ~ handleBookmark ~ postId:", { _id: postId })

        console.log("-------" + req.body);

        let bookmark = await Bookmark.findOne({ user: userId });

        if (bookmark) {
            if (!bookmark.posts.includes(postId)) {
                // const updatedBookmark = await Bookmark.findOneAndUpdate(
                //     { user: userId },
                //     { $push: { posts: { _id: postId } } },
                //     { new: true }
                // );
                bookmark.posts.push(postId);
                bookmark.save();
            } else {
                // const updatedBookmark = await Bookmark.findOneAndUpdate(
                //     { user: userId },
                //     { $pull: { posts: postId } },
                //     { new: true },
                // );
                // if (updatedBookmark.posts.length === 0) {
                //     await Bookmark.findByIdAndDelete(updatedBookmark._id);
                // }
                bookmark.posts.pull(postId);
                bookmark.save();
            }
        } else {
            bookmark = new Bookmark({ user: userId, posts: [postId] });
            await bookmark.save();
        }
        console.log("🚀 ~ handleBookmark ~ bookmark:", bookmark)

        res.status(201).json({ bookmark });
    } catch (error) {
        next(error);
    }
};


const deleteBookmark = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { postId } = req.params;

        const updatedBookmark = await Bookmark.findOneAndUpdate(
            { user: userId },
            { $pull: { posts: postId } },
            { new: true }
        );

        if (!updatedBookmark) {
            return res.status(404).json({ message: "Bookmark not found" });
        }

        if (updatedBookmark.posts.length === 0) {
            await Bookmark.findByIdAndDelete(updatedBookmark._id);
        }

        res.status(200).json({ message: "Bookmark removed" });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllBookmarks, handleBookmark, deleteBookmark, getBookmarksByUser };