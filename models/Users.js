const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter Name first"],
        min: 5,
        max: 20,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Enter Email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        min: 5,
        max: 100
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("users", userSchema);