const Activity = require("../models/Activity.js");
const Post = require("../models/Post.js");

const getAllActivities = async (req, res, next) => {
    try {
        const allActivities = await Activity.find();
        res.status(200).json({ allActivities });
    } catch (error) {
        next(error);
    }
};

const getActivityByUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const foundActivities = await Activity.find({ user: userId });
        res.status(200).json({ foundActivities });
    } catch (error) {
        next(error);
    }
};

const getActivityByType = async (req, res, next) => {
    try {
        const { type, postId } = req.params;
        console.log("🚀 ~ getActivityByType ~ postId:", postId)
        console.log("🚀 ~ getActivityByType ~ type:", type)
        const foundActivities = await Activity.find({ post: postId, type: type });
        console.log("🚀 ~ getActivityByType ~ foundActivities:", foundActivities)
        res.status(200).json({ foundActivities });
    } catch (error) {
        next(error);
    }
};

const getActivityByPost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const foundActivities = await Activity.find({ post: postId });
        res.status(200).json({ foundActivities });
    } catch (error) {
        next(error);
    }
};

const addActivity = async (req, res, next) => {
    try {
        const postId = req.body.post;
        const type = req.body.type;
        const newActivityData = {
            ...req.body,
            user: req.user.id,
        };

        const newActivity = await Activity.create(newActivityData);
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $inc: { [type]: 1 } },
            { new: true }
        );
        res.status(201).json({ newActivity, updatedPost });
    } catch (error) {
        next(error);
    }
};
const deleteActivity = async (req, res, next) => {
    try {
        const { activityId } = req.params;
        const { userId } = req.user.userId;
        const checkActivity = await Activity.findById(activityId);
        if (userId !== checkActivity.author) {
            return res.status(400).json({
                message: `You don't have permission to delete this activity`,
            });
        }
        const foundActivity = await Activity.findByIdAndDelete(activityId);
        if (!foundActivity) {
            return res.status(400).json({
                message: `Oops, it seems like the activity you're looking for is not there`,
            });
        }
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllActivities, getActivityByUser, getActivityByType, getActivityByPost, addActivity, deleteActivity } 