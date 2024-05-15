const express = require("express");
const router = express.Router();
const { login, signUp } = require("./auth.controller");
const { fileUpload } = require("../middlewares/fileUpload");

router.post('/login', login);

router.post('/signup', fileUpload.single("image"), signUp);

module.exports = router;