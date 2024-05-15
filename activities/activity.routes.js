const express = require("express");
const router = express.Router();
const { getAllActivities, getActivityByUser, getActivityByType, getActivityByPost, addActivity, deleteActivity } = require("./activity.controllers.js");
const { authenticateToken } = require("../middlewares/auth.js");


router.get("/", getAllActivities);

router.get("/user/:userId", getActivityByUser);

router.get("/:postId/:type", getActivityByType);

router.get("/post/:postId", getActivityByPost);

router.post("/", authenticateToken, addActivity);

router.delete('/:activityId', authenticateToken, deleteActivity);


module.exports = router;