const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

const User = require('../models/user');

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      };
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      };
      bcrypt.compare(password, user.password, (err, res) => {
        // not sure if err handling should stay here, remove if it causes problems
        if (err) {
          done(err);
        };

        if (res) {
          // password match, login user
          return done(null, user);
        } else {
          // password does not match
          return done(null, false, { message: 'Incorrect password' });
        };
      });
    });
  })
);

// passport.serializeUser(function(user, cb) {
//   process.nextTick(function() {
//     cb(null, { id: user.id, username: user.name });
//   });
// });

// passport.deserializeUser(function(user, cb) {
//   process.nextTick(function() {
//     return cb(null, user);
//   });
// });
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
