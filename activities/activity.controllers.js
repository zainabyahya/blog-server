const Activity = require("../models/Activity.js");

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
        const foundActivities = await Activity.findById({ user: userId });
        res.status(200).json({ foundActivities });
    } catch (error) {
        next(error);
    }
};

const getActivityByType = async (req, res, next) => {
    try {
        const { type } = req.params;
        const foundActivities = await Activity.findById({ type: type });
        res.status(200).json({ foundActivities });
    } catch (error) {
        next(error);
    }
};

const getActivityByActivity = async (req, res, next) => {
    try {
        const { activityId } = req.params;
        const foundActivities = await Activity.findById({ Activity: activityId });
        res.status(200).json({ foundActivities });
    } catch (error) {
        next(error);
    }
};

const addActivity = async (req, res, next) => {
    try {
        const newActivityData = { ...req.body };
        const newActivity = await Activity.create(newActivityData);
        res.status(201).json({ newActivity });
    } catch (error) {
        next(error);
    }
};
const deleteActivity = async (req, res, next) => {
    try {
        const { activityId } = req.params;
        const { userId } = req.user.userId;
        const checkActivity = await Activity.findByIdAndDelete(activityId);
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

module.exports = { getAllActivities, getActivityByUser, getActivityByType, getActivityByActivity, addActivity, deleteActivity } 