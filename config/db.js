const mongoose = require("mongoose");

const connectDB = async() => {
    try {
        const connect = await mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });

        // console.log(`Connected to ${connect.connection.host}`);
        console.log(`Connected to MongoDB`);
    } catch (error) {
        console.log(`Error : ${error}`);
    }
};

module.exports = connectDB;