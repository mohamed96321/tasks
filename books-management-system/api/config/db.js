// Connect to mongodb
const mongoose = require('mongoose');

const connectToDatabase = async () => {
  try {
    const connect = await mongoose.connect(process.env.DB_URI);
    console.log(`MongoDatabase connected on host: ${connect.connection.host}`);
  } catch (error) {
    console.log(`Error occurred in DATABASE: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
