const Bookmark = require("../models/Bookmark.js");


const getAllBookmarks = async (req, res, next) => {
    try {
        const allBookmarks = await Bookmark.find().populate("posts");
        res.status(200).json({ allBookmarks });
    } catch (error) {
        next(error);
    }
};

const addBookmark = async (req, res, next) => {
    try {
        const newBookmarkData = { ...req.body };
        const newBookmark = await Bookmark.create(newBookmarkData);
        res.status(201).json({ newBookmark });
    } catch (error) {
        next(error);
    }
};


const deleteBookmark = async (req, res, next) => {
    try {
        const bookmarkId = req.params;
        const userId = req.user.userId;

        const checkBookmark = await Bookmark.findById(bookmarkId);
        if (userId !== checkBookmark.user.toString()) {
            return res.status(400).json({
                message: `You don't have permission to remove this post`,
            });
        }
        await Bookmark.findByIdAndDelete(bookmarkId);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllBookmarks, addBookmark, deleteBookmark };