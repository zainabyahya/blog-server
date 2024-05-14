const express = require("express");
const router = express.Router();
const { getAllActivities, getActivityByUser, getActivityByType, getActivityByPost, addActivity, deleteActivity } = require("./activity.controllers.js");
const { authenticateToken } = require("../middlewares/auth.js");


router.get("/", getAllActivities);

router.get("/user/:userId", getActivityByUser);

router.get("/author/:type", getActivityByType);

router.get("/category/:postId", getActivityByPost);

router.post("/", authenticateToken, addActivity);

router.delete('/:activityId', authenticateToken, deleteActivity);


module.exports = router;