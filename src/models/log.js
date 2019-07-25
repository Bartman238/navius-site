const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LogSchema = new Schema({
  cdate: Date,
  route: String,
  description: String,
  err: String
});

const Log = mongoose.model("Log", LogSchema);
module.exports = Log;