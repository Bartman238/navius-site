const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DocSchema = new Schema({
  cdate: Date,
  name: String,
  link: String
});

const Doc = mongoose.model("Doc", DocSchema);
module.exports = Doc;