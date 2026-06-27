const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const connectDb = async ()=>{
    await mongoose.connect(process.env.DATABASE_URL);
};

module.exports = connectDb;
