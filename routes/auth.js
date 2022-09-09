const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const async = require('async');

const User = require('../models/user');
const Cart = require('../models/cart');



router.get('/login', function (req, res, next) {
  res.render('login', 
    { 
      title: 'Login'
    });
});

// "local" refers to passportjs local strategy
// passport.authenticate() runs the code of passport.use(new Localstrategy...)
router.post('/login/password', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); };
    res.redirect('/');
  });
});

router.get('/signup', function(req, res, next) {
  res.render('signup',
    {
      title: 'Signup'
    }
  );
});

router.post('/signup', function(req, res, next) {
  //encrypt the password before saving to database
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    if (err) {
      return next(err);
    };
    // success

    
    async.waterfall([
      function(callback) {
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
          is_admin: req.body.is_admin,
          is_member: false
        });

        user.save((err, user) => {
          if (err) {
            return next(err);
          };

          callback(null, user);
        });
      },
      function(user, callback) {
        const cart = new Cart({
          owner: user.id,
          contents: [],
        });

        cart.save((err, cart) => {
          if (err) {
            return next(err);
          };

          callback(null, 'done');
        });
      },
    ], function(err, result) {
      if (err) {
        return next(err);
      };

      // success
      res.redirect('/');
    });


  });
});
// router.post('/signup', function(req, res, next) {
//   bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
//     if (err) { 
//       return next(err); 
//     };
//     const createdUser = new User({
//       username: req.body.username,
//       password: hashedPassword,
//       is_admin: req.body.is_admin,
//       is_member: false
//     }).save(err => {
//       if (err) {
//         return next(err);
//       };
//       var user = {
//         id: this.lastID,
//         username: req.body.username
//       };
//       req.login(user, function(err) {
//         if (err) {
//           return next(err);
//         };
//         // success
//         res.redirect('/');
//       });
//     });
//   });
// });

module.exports = router;
