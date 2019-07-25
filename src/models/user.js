const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  login: String,
  passwordHash: String
});

const User = mongoose.model("User", UserSchema);
module.exports = User;