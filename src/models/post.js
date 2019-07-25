const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  image: mongoose.Schema.Types.Mixed,
  title: String,
  description: String,
  content: String,
  cdate: Date
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;