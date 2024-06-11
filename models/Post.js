const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const postSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    introduction: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: String,
    dateCreated: {
        type: Date,
        required: true
    },
    dateEdited: Date,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    tags: [
        {
            type: Schema.Types.ObjectId,
            ref: "Category"
        }
    ],
    likeCount: {
        type: Number,
        default: 0
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],



});

const Post = model('Post', postSchema);
module.exports = Post;

