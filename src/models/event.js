const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const _EventSchema = new Schema({
  title: String,
  content: String,
  time: Date,
  price: Number,
  free: Boolean,
  isActive: Boolean,
  records: [{
    name: String,
    lname: String,
    email: String,
    tel: String
  }]
});

const _Event = mongoose.model("_Event", _EventSchema);
module.exports = _Event;