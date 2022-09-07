const { body, validationResult } = require('express-validator');

const User = require('../models/user');
const Product = require('../models/product');

exports.home = function (req, res) {
  res.render('home', 
    { 
      title: 'Primal'
    });
};

// SHOP
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

exports.cart = function (req, res) {
  res.render('cart', 
  { 
    title: 'Cart'
  });
};

exports.product_detail = function (req, res, next) {
  
}


// MEMBERSHIP
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
