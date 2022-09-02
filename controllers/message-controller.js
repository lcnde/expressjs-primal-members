const { body, validationResult } = require('express-validator');

const User = require('../models/user');
const Message = require('../models/message');

exports.talkBoard_get = function (req, res) {
  res.render('talk-board',
  {
    title: 'talkboard'
  });
};

// to check if the user is logged-in, use the session ID. The form can get hacked if it requires only the name because it is easy to send an username along with a request. On the other hand sending a sessionID is not hard either but the session has to correspond to one present in the database so a hacker should either steal someone session or guess the sessionID of someone else. Both is harder than just editing the request to submit an username.
exports.message_post = [
  // validate and sanitize
  body('message')
    .not().isEmpty().withMessage('Message can not be empty.')
    // .isLength({max: 3}).withMessage('just a test delete this')
    .trim()
    .escape(),

  // process request after validation and sanitization
  (req, res, next) => {

    //check for errors
    const errors = validationResult(req);

    // save the message content so if the page reloads you can serve it back to the user
    var messageContent = req.body.message

    if (!errors.isEmpty()) {
      // there are errors so reload the page with the errors
      res.render('talk-board',
      {
        err: errors.array(),
        title: 'talkboard',
        message: messageContent
      });
      return;
    }

    // success, no errors found
    // console.log(req.session.passport.user);
    User.findOne({ id: req.session.passport.user }, (err, user) => {
      if (err) {
        return next(err);
      };
      // success, user exists in the database

      // create the message 
      const message = new Message(
        {
          author: user.id,
          message: req.body.message,
          // date: new Date(Date.now()).toDateString(),
          date: new Date(Date.now()),
        }
      );

      message.save(function(err) {
        if (err) {
          return next(err);
        };

        res.render('talk-board', {
          title: 'talkboard',
        })
      })

            
      
    });
  }
]
