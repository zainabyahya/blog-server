const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    type: { type: String, enum: ['like', 'comment', 'bookmark'], required: true },
    commentText: {
        type: String,
        validate: {
            validator: function (value) {
                return this.type !== 'comment' || !!value;
            },
            message: 'Comment text is required for comment type'
        }
    },
});

module.exports = mongoose.model('Activity', activitySchema);
