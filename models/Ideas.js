const mongoose = require("mongoose");

const ideasModel = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please Enter the title"],
        min: 5,
        max: 10,
        trim: true
    },
    details: {
        type: String,
        required: [true, "Please Enter the details"],
        min: 20,
        max: 30,
        trim: true
    },
    user: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Ideas", ideasModel);