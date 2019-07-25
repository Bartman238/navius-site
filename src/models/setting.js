const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SettingSchema = new Schema({
  global: mongoose.Schema.Types.Mixed,
});

const Setting = mongoose.model("Setting", SettingSchema);
module.exports = Setting;