var mongoose = require("mongoose");
mongoose.set("strictQuery", true);
var passportLocalMongoose = require("passport-local-mongoose");
// mongoose.connect('mongodb://127.0.0.1:27017/myPinterest1');

var path = require("path");
require("dotenv").config({ path: "./.env" });
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error men:", error);
  });

var usersSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  photo: [{ type: String }],
  savedPhotos: [{ type: Object }],
});

usersSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("user", usersSchema);
