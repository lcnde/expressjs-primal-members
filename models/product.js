const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OptionSubSchema = new Schema(
  {
    quantity: {type: String, required: true},
    cost: {
      price: {type: Number, required: true},
      members_price: {type: Number, required: true}
    }
  }
);

const ProductSchema = new Schema(
  {
    name: {type: String, required: true},
    option: [OptionSubSchema],
    description: {type: String, required: true},
    photo_url: {type: String, required: true},
    flavor: [{type: Schema.Types.ObjectId, ref: 'Flavor', required: true}],
  }
);

// the url passes a default option when opening the product page from the shop. In this case the default option is just the first one, for no particular reason.
ProductSchema.virtual('url')
  .get(function() {
    let productName = this.name;
    let hyphenProductName = productName.replace(/\s/g, '-');
    return '/product/' + hyphenProductName + '/' + this._id + '/' + this.option[0].quantity;
  });

module.exports = mongoose.model('Product', ProductSchema);
