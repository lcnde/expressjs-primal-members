const { body, validationResult } = require('express-validator');
const async = require('async');

const User = require('../models/user');
const Product = require('../models/product');
const Flavor = require('../models/flavor');
const Cart = require('../models/cart');

exports.home = function (req, res) {
  res.render('home', 
    { 
      title: 'Primal'
    });
};

// SHOP -----------------------------------------
exports.shop = function (req, res, next) {

  Product.find({})
    .exec((err, products) => {
      if (err) {
        return next(err);
      };

      // success
      res.render('shop', {
        title: 'Primal | Shop',
        products: products,
      });
    })
};

exports.cart_get = function (req, res, next) {
  // console.log(req.session)

  if (req.session.passport) {
    async.waterfall([
      function(callback) {
        Cart.findOne({'owner': req.session.passport.user})
          .populate(('contents.product'))
          .populate(('contents.flavor'))
          .exec(function(err, cart) {
            if (err) {
              return next(err);
            };
  
            callback(null, cart);
          });
        },
    ], function(err, result) {
      if (err) {
        return next(err);
      };
      
      const rawCartContents = result.contents;
      
      // we add the price and members_price for each cart item
      const pricedCartContents = rawCartContents.map(item => {
        let price = 0;
        let members_price = 0;
        for (let i = 0; i < item.product.options.length; i++) {
          if (item.option === item.product.options[i].weight) {
            price = item.product.options[i].cost.price;
            members_price = item.product.options[i].cost.members_price;
          };
        };

        let totalPrice = price * item.quantity;
        let totalMembersPrice = members_price * item.quantity;


        return {
          product: {
            _id: item.product.id,
            name: item.product.name,
            description: item.product.description,
            photo_url: item.product.photo_url,
            default_url: item.product.default_url,
          },
          option: item.option,
          quantity: item.quantity,
          flavor: item.flavor,
          totalPrice: totalPrice,
          totalMembersPrice: totalMembersPrice,
          _id: item._id
        }
      })
      
      // we remove product.options and product.flavor since they are a list of all options and flavors available for that product. We don't need these 2 lists since we already have option and flavor selected by the user.
      const filteredCartContents = pricedCartContents.map(item => ({
        product: {
          _id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          photo_url: item.product.photo_url,
          default_url: item.product.default_url,
        },
        option: item.option,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        totalMembersPrice: item.totalMembersPrice,
        flavor: item.flavor,
        _id: item._id
      }));  

      // console.log(filteredCartContents)

      // function to calculate the checkout prices
      const calcCheckout = (arr) => {
        let checkoutTotal = 0;
        let checkoutMembersTotal = 0;
        let checkoutMembersDiscount = 0;

        for (let i = 0; i < arr.length; i++) {
          checkoutTotal += arr[i].totalPrice;
          checkoutMembersTotal += arr[i].totalMembersPrice;
          checkoutMembersDiscount = checkoutTotal - checkoutMembersTotal;
        };

        return {
          checkoutTotal: checkoutTotal,
          checkoutMembersTotal: checkoutMembersTotal,
          checkoutMembersDiscount: checkoutMembersDiscount
        };
      };

      const checkoutPrice = calcCheckout(filteredCartContents);

      // console.log(filteredCartContents);

      // success
      res.render('cart', 
      { 
        title: 'Primal | Cart',
        cartContents: filteredCartContents,
        checkoutPrice: checkoutPrice
      });
    });
  } else {
    res.render('cart', {
      title: 'Primal | Cart'
    })
  }

};

exports.cart_post = [
  // validate and sanitize fields
  body('product_option')
  .not().isEmpty().withMessage('Missing parameter')
  .trim()
  .escape(),
  body('product')
  .not().isEmpty().withMessage('Missing parameter')
  .trim()
  .escape(),
  body('product_quantity')
  .not().isEmpty().withMessage('Missing parameter')
  .trim()
  .escape(),
  body('product_flavor')
  .not().isEmpty().withMessage('Missing parameter')
  .trim()
  .escape(),
  
  // process request
  (req, res, next) => {
    // console.log(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // req.body validation gave errors
      let errorMsg = (errors.array())[0].msg
      let err = new Error(errorMsg);
      return next(err);
    };
    
    // check that the user is logged in 
    if (req.session.passport.user) {
      async.waterfall([
        function(callback) {
          // find the cart of the user
          Cart.findOne({'owner': req.session.passport.user})
            .exec((err, cart) => {
              if (err) {
                return next(err);
              };

              callback(null, cart)
            });
        },
        function(result, callback) {
          let cart = result.contents;
          let item = {
            product: req.body.product,
            option: req.body.product_option,
            quantity: parseInt(req.body.product_quantity),
            flavor: req.body.product_flavor,
          };
          let isPresent = false;
          // console.log(item.quantity);
          // console.log(cart[0].product.valueOf());

          // check if the item already exists in the cart, and if it does add new quantity to it
          for (let i = 0; i < cart.length; i++) {
            if (item.product === cart[i].product.valueOf() &&
                item.option === cart[i].option &&
                item.flavor === cart[i].flavor.valueOf()){
                  cart[i].quantity += item.quantity;
                  isPresent = true;
                };
          };

          // if the item does not already exist in the cart add a new record
          if (isPresent === false) {
            cart.push(item);
          };

          // console.log(cart);

          callback(null, cart);
        },
        function(result, callback) {
          // the cart is nice and organized so now we can update it in the database
          Cart.findOneAndUpdate(
            {'owner': req.session.passport.user},
            {'contents': result},
            null,
            function(err, result) {
              if (err) {
                return next(err);
              };

              callback(null, result);
            },
          );
        },
      ], function(err, result) {
        if (err) {
          return next(err);
        };

        // console.log(result)

        res.redirect('/cart')
      })

      return;
    };

    // if the user is not logged in then redirect
    res.redirect('/login')
    
  }
];

exports.cart_delete_post = (req, res, next) => {
  // console.log(req.body)
  Cart.updateOne(
    {'owner': req.session.passport.user},
    {$pull: {contents: {_id: req.body.product_id}}},
  ).exec((err, result) => {
    if (err) {
      return next(err);
    };

    res.redirect('/cart');
  })
};

exports.cart_update_quantity = (req, res, next) => {
  if (req.body.product_add === 'true'){
    // add +1 to product quantity
    Cart.updateOne(
      {'owner': req.session.passport.user, 'contents._id': req.body.product_id},
      {$inc: {'contents.$.quantity': 1}}
      ).exec((err, result) => {
        if (err) {
          console.log(err)
          return next(err);
        };

        res.redirect('/cart');
      });
  };

  if (req.body.product_subtract === 'true') {
    // remove +1 to product quantity
    Cart.updateOne(
      {'owner': req.session.passport.user, 'contents._id': req.body.product_id},
      {$inc: {'contents.$.quantity': -1}}
      ).exec((err, result) => {
        if (err) {
          console.log(err)
          return next(err);
        };

        res.redirect('/cart');
      });
  };
};

exports.product_detail = function (req, res, next) {
  Product.findById(req.params.id)
    .populate({path: 'flavor'})
    .exec(function(err, product) {
      if (err) {
        return next(err);
      };
      if (product == null) {
        // no results
        let err = new Error('Product not found');
        err.status = 404;
        return next(err);
      };
      const checkOption = ((product) => {
        // this functions checks if the option passed into the parameter url exists, and if it does not, it returns an error.
        let options = [];
        for (let i = 0; i < product.options.length; i++) {
          options.push(product.options[i].weight);
        };
        if (options.includes(req.params.option)) {
          return;
        };
        // product options doesn't include option passed into url parameter, return error
        let err = new Error('Option not found');
        err.status = 404;
        return ['error', next(err)];
      })(product);
      if (checkOption) {
        // this stops the execution of the product_detail function so the res.render doesnt execute, this way you don't get the "Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client" error.
        return;
      };

      const passPrice = (()=>{
        // pass into the template the price of the product based on what parameters is passed into the url for the :option
        let pricing = {price:0, members_price: 0};
        for (let option in product.options) {
          if (product.options[option].weight === req.params.option) {
            pricing.price = product.options[option].cost.price;
            pricing.members_price = product.options[option].cost.members_price;
          };
        };
        if (pricing.price === 0 || pricing.members_price === 0) {
          // if the price doesnt change from 0 then there was an error in calculating it
          let err = new Error('Error in calculating price');
          err.status = 500 // internal server error
          return next(err);
        };
        // console.log(pricing);
        // success
        return pricing;
      })();

      // success
      res.render('product_detail', {
        title: product.name,
        product: product,
        selected_product: req.params.option,
        pricing: passPrice,
      });
    });
};
// SHOP -----------------------------------------

// MEMBERSHIP ----------------------------------
exports.membership = function (req, res) {
  res.render('membership', 
  { 
    title: 'Primal | Membership'
  });
};

exports.membership_join = [
    // validate and sanitize
    body('passcode')
    .not().isEmpty().withMessage("Passcode can't be empty")
    .trim()
    .escape(),

    // process request after validation
    (req, res, next) => {
      // check for errors
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.render('membership', {
          title: 'Primal | Membership',
          err: errors.array(),
        });
        return;
      }

      // no errors found
      if (req.body.passcode === 'Primal') {
        // good passcode, give user membership
        User.findByIdAndUpdate(
          req.session.passport.user, 
          {is_member: true}, 
          (err, user) => {
          if (err) {
            return next(err);
          };
    
          res.redirect('/membership')
        });
        return;
      }
      
      // wrongs passcode, render with errors
      res.render('membership', {
        title: 'Primal | Membership',
        err: [{msg: 'Wrong passcode'}]
      });
    }
];

exports.membership_delete = function (req, res, next) {
  // check if user exists
  User.findByIdAndUpdate(req.session.passport.user, {
    is_member: false,
  }, (err, user) => {
    if (err) {
      return next(err);
    };

    res.redirect('/membership');
  });
}
// MEMBERSHIP ----------------------------------
