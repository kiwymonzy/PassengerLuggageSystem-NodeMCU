const mongoose = require('mongoose');
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const recordSchema = new Schema({
  name: { 
    type: String,
    required: true,
  },
  card_id: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
  },
  destination: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

recordSchema.virtual("date_formatted").get(function() {
  return this.date ? DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED) : "";
});

module.exports = mongoose.model('Record', recordSchema);
