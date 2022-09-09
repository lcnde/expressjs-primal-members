const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OptionsSubSchema = new Schema(
  {
    weight: {type: String, required: true},
    cost: {
      price: {type: Number, required: true},
      members_price: {type: Number, required: true}
    }
  }
);

const ProductSchema = new Schema(
  {
    name: {type: String, required: true},
    options: [OptionsSubSchema],
    description: {type: String, required: true},
    photo_url: {type: String, required: true},
    flavor: [{type: Schema.Types.ObjectId, ref: 'Flavor', required: true}],
  }
);

// the url passes a default option when opening the product page from the shop. In this case the default option is just the first one, for no particular reason.
ProductSchema.virtual('default_url')
  .get(function() {
    let productName = this.name;
    let hyphenProductName = productName.replace(/\s/g, '-');
    return '/product/' + hyphenProductName + '/' + this._id + '/' + this.options[0].weight;
  });

// this url will be used to select product options. To the url provided by the virtual, from the pugjs template, the code will append the product option
ProductSchema.virtual('url')
.get(function() {
  let productName = this.name;
  let hyphenProductName = productName.replace(/\s/g, '-');
  return '/product/' + hyphenProductName + '/' + this._id;
});

module.exports = mongoose.model('Product', ProductSchema);
