const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
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
});

userSchema.virtual('url').get(function() {
  return `/index/users/${this._id}`;
});

module.exports = mongoose.model('User', userSchema);