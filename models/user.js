const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {type: String, required: true, maxLength: 100},
    password: {type: String, required: true, maxLength: 24},
    is_member: {type: Boolean, required: true},
    is_admin: {type: Boolean, required: true},
  }
);

module.exports = mongoose.model('User', UserSchema);
