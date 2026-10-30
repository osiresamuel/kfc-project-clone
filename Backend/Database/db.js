const mongoose = require("mongoose");

const connectDatabase = () => {
  const uri = process.env.DATABASE;
  if (!uri) {
    return Promise.reject(new Error("DATABASE environment variable is required"));
  }

  return mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
};

module.exports = connectDatabase;