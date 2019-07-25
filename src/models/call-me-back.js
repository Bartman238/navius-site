const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CMBSchema = new Schema({
  cdate: Date,
  name: String,
  tel: String
});

const CMB = mongoose.model("CMB", CMBSchema);
module.exports = CMB;