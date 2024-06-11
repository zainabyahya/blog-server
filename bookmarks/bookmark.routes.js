const express = require("express");
const router = express.Router();
const { getAllBookmarks, handleBookmark, deleteBookmark, getBookmarksByUser } = require("./bookmark.controllers.js");
const { authenticateToken } = require("../middlewares/auth.js");

router.get("/", getAllBookmarks);

router.get("/:userId", authenticateToken, getBookmarksByUser);

router.post("/", authenticateToken, handleBookmark);

router.delete("/:postId", authenticateToken, deleteBookmark);


module.exports = router;