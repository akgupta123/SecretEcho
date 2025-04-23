
const mongoose = require('mongoose');
mongoose.set({'strictQuery': true})
module.exports.connectDB = async () => {
    try {
      await mongoose.connect(
        process.env.MONGO_DB_URI,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
      console.log('MongoDB Connected');
    } catch (err) {
      console.error(err.message);
   
      process.exit(1);
    }
};
