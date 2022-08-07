const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    message: {type: String, required: true},
    date: {type: Date, required: true}
  }
);

module.exports = mongoose.model('Post', PostSchema);
