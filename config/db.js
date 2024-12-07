const mongoose = require("mongoose");

const MongoURI = "mongodb://localhost:27017/full-stack-app-backend";

const connect = async () => {
  try {
    await mongoose.connect(MongoURI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connect;
