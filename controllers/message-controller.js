const Message = require('../models/message');
const { body, validationResult } = require('express-validator');

const User = require('../models/user')

exports.talkBoard_get = function (req, res) {
  res.render('talk-board',
  {
    title: 'talkboard',
    stylesheetName: 'talkboard.css'
  });
};

// to check if the user is logged-in, use the session ID. The form can get hacked if it requires only the name because it is easy to send an username along with a request. On the other hand sending a sessionID is not hard either but the session has to correspond to one present in the database so a hacker should either steal someone session or guess the sessionID of someone else. Both is harder than just editing the request to submit an username.
exports.message_post = [
  // validate and sanitize
  body('message')
    .not().isEmpty().withMessage('Message can not be empty.')
    .trim()
    .escape(),

  // process request after validation and sanitization
  (req, res, next) => {
    // console.log(req.session.passport.user)
    User.findOne({ id: req.session.passport.user }, (err, user) => {
      if (err) {
        return next(err);
      };

      // user_id exists in the database
    })
    
    res.redirect('/talk-board');
  }
]
