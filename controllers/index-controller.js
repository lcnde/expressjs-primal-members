const User = require('../models/user');

exports.home = function (req, res) {
  res.render('home', 
    { 
      title: 'Primal'
    });
};


exports.shop = function (req, res) {
  res.render('shop', 
  { 
    title: 'shop'
  });
};



exports.cart = function (req, res) {
  res.render('cart', 
  { 
    title: 'Cart'
  });
};

// MEMBERSHIP
exports.membership = function (req, res) {
  res.render('membership', 
  { 
    title: 'membership'
  });
};

exports.membership_join = function (req, res, next) {
  // check if the user exists
  User.findById( req.session.passport.user )
    .exec((err, user) => {
      if (err) {
        return next(err);
      };

      // success, user exists.
      if (req.body.passcode === 'Primal') {
        // good passcode, give user membership
        User.findByIdAndUpdate(req.session.passport.user, {
          is_member: true,
        }, (err, user) => {
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
        err: 'Wrong passcode'
      });
    });
};
