const mongoose = require("mongoose");
require('dotenv').config({})

const connectDb = () => {
    console.log("database connected");
    return mongoose.connect(process.env.MONGODB_URL);
}

module.exports={connectDb};

