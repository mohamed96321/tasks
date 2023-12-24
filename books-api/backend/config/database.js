const mongoose = require("mongoose");
const env = require("./env");

const connectToDatabase = async () => {
  try {
    mongoose.Promise = global.Promise;
    const connect = await mongoose.connect(env.mongoURI);
    console.log(
      `Database connected succussfully on host: %s.`,
      connect.connection.host,
    );
  } catch (error) {
    console.log(`Error occured in database: %s.`, error);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
