const mongoose = require("mongoose");
const { Schema, model } = mongoose;

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        lowercase: true,
        unique: true,
        trim: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        trim: true,
        required: 'Password is required',
        minlength: 8,
    },
    image: String,
    bookmark: { type: Schema.Types.ObjectId, ref: 'Bookmark' }
});

const User = model('User', userSchema);
module.exports = User;