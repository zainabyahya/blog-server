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
    activities: [
        {
            type: Schema.Types.ObjectId,
            ref: "Activity"
        }
    ],
    tags: [
        {
            type: Schema.Types.ObjectId,
            ref: "Category"
        }
    ],
    like: {
        type: Number,
        defualt: 0
    },
    comment: {
        type: Number,
        default: 0
    },
    bookmark: {
        type: Number,
        default: 0
    }

});

const Post = model('Post', postSchema);
module.exports = Post;