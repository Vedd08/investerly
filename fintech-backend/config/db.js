const mongoose = require('mongoose');

const connectDB = async (retries = 5) => {
  while (retries) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      break;
    } catch (error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      if (retries === 0) {
        console.error("Could not connect to MongoDB after multiple attempts. Exiting...");
        process.exit(1);
      }
      // Wait for 5 seconds before retrying
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

module.exports = connectDB;
