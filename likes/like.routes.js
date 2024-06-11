const express = require("express");
const router = express.Router();
const { getAllLikes, handleLike, deleteLike } = require("./like.controllers.js");
const { authenticateToken } = require("../middlewares/auth.js");

router.get("/", getAllLikes);

router.post("/", authenticateToken, handleLike);

router.delete("/:postId", authenticateToken, deleteLike);


module.exports = router;