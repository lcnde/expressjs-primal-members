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
        title: 'shop',
        products: products,
      });
    })
};

exports.cart = function (req, res, next) {

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

    const cartContents = result.contents;

    



    // success
    res.render('cart', 
    { 
      title: 'Cart',
      cartContents: cartContents
    });
  });
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
    console.log(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // req.body validation gave errors
      let errorMsg = (errors.array())[0].msg
      let err = new Error(errorMsg);
      return next(err);
    };
    
    async.waterfall([
      function(callback) {
        // check if the user exists. Only logged in users can add things to cart.
        User.findById(req.session.passport.user)
          .exec((err, user)=>{
            if (err) {
              return next(err);
            };
            
            callback(null, user);
          });
      },
      function(user, callback) {
        // this function pushes the product to users cart
        const addToCart = {
          product: req.body.product,
          option: req.body.product_option,
          quantity: req.body.product_quantity,
          flavor: req.body.product_flavor
        }


        // This function has 4 parameters i.e. filter,
        // update, options, callback
        Cart.findOneAndUpdate({ 'author': user.id },
          {$push: {contents: addToCart}}, 
          null, 
          function(err, result) {
            if (err) {
              return next(err);
            };

            callback(null, result)
          });
      },
    ], function(err, result) {
      if (err) {
        return next(err);
      };
      console.log(result)
      res.redirect('/cart');
    })


    
  }
]

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
    title: 'membership'
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
          title: 'membership',
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
        title: 'membership',
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
