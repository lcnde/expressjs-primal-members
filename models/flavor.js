const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FlavorSchema = new Schema(
  {
    name: {type: String, required: true, unique: true},
    photo_url: {type: String, required: true}
  }
);

module.exports = mongoose.model('Flavor', FlavorSchema);
