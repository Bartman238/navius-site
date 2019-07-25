const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubscriberSchema = new Schema({
  cdate: Date,
  email: String
});

const Subscriber = mongoose.model("Subscriber", SubscriberSchema);
module.exports = Subscriber;