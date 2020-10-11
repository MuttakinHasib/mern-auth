const mongoose = require('mongoose');
const { mongoURI } = require('./dev');

const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(mongoURI, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB running on : ${connection.host}`);
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = connectDB;
