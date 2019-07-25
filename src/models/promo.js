const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PromoSchema = new Schema({
  cdate: Date,
  image: Schema.Types.Mixed,
  toDate: Date,
  title: String,
  description: String,
  conditions: String,
  archive: Boolean
});

const Promo = mongoose.model("Promo", PromoSchema);
module.exports = Promo;