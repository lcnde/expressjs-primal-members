const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {type: String, required: true},
    price: {type: Double, required: true},
    members_price: {type: Double, required: true},
    description: {type: String, required: true},
    photo_url: {type: String, required: true},
    flavor: [{type: Schema.Types.ObjectId, ref: 'Flavor', required: true}],
    option: {type: Array, required: true}
  }
);

module.exports = mongoose.mode('Product', ProductSchema);
