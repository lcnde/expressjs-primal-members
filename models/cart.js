const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CartSubSchema = new Schema(
  {
    product: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
    option: {type: String, required: true},
    quantity: {type: Number, required: true},
    flavor: {type: Schema.Types.ObjectId, ref: 'Flavor', required: true}
  }
)

const CartSchema = new Schema(
  {
    owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    contents: [CartSubSchema],
  }
);

module.exports = mongoose.model('Cart', CartSchema);
