const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CartSchema = new Schema(
  {
    owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    contents: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  }
);

module.exports = mongoose.model('Cart', CartSchema);
