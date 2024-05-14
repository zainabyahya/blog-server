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
        type: Date.now(),
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
    ]

});

const Post = model('Post', PostSchema);
module.exports = Post;