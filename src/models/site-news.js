const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SiteNewsSchema = new Schema({
  image: mongoose.Schema.Types.Mixed,
  title: String,
  description: String,
  content: String,
  cdate: Date,
  views: Number
});

const SiteNews = mongoose.model("SiteNews", SiteNewsSchema);
module.exports = SiteNews;