var mongoose = require("mongoose");
mongoose.set('strictQuery', true);
var passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/myPinterest1');

var usersSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
})



usersSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', usersSchema);