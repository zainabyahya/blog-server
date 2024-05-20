const express = require("express");
const router = express.Router();
const { getAllBookmarks, addBookmark, deleteBookmark } = require("./bookmark.controllers.js");
const { authenticateToken } = require("../middlewares/auth.js");

router.get("/", getAllBookmarks);

router.post("/", authenticateToken, addBookmark);

router.delete("/", authenticateToken, deleteBookmark);


module.exports = router;