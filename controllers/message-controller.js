const { body, validationResult } = require('express-validator');

const User = require('../models/user');
const Message = require('../models/message');

exports.talkBoard_get = function (req, res, next) {
  Message.find()
    .populate({path: 'author', select: 'username'}) // populate only with name
    .exec(function(err, messages) {
      if (err) {
        return next(err);
      };

      // successful so render
      res.render('talk-board', {
        title: 'Primal | Talkboard',
        messages: messages,
      });
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

    //check for errors
    const errors = validationResult(req);
    // save the message content so if the page reloads you can serve it back to the user

    console.log(errors)
    
    if (!errors.isEmpty()) {
      // there are errors so reload the page with the errors
      res.redirect('talk-board')
      return;
    }
    
    // success, no errors found
    User.findOne({ '_id': req.session.passport.user })
      .exec((err, user) => {
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

        res.redirect('talk-board');
      })
      
    });
  }
];

exports.message_delete_post = (req, res, next) => {
  // only admins can delete messages, so check that the user is an admin before allowing that
  User.findById( req.session.passport.user )
    .exec((err, user) => {
      
      if (err) {
        return next(err);
      };
      // success, user exists
      if (user.is_admin === true) {
        // user is admin, remove message
        Message.findByIdAndRemove(req.body.message_id)
          .exec(function(err, result) {
            if (err) {
              return next(err);
            };
            // success so render
            res.redirect('/talk-board');
          });
          return;
      }
  
      // user is not an admin, reject and render errors
      // const errors = ['You are not allowed to do that.']
      // res.render('talk-board', {
      //   title: 'talkboard',
      //   err: errors,
      // })

      // redirect bcause user is not an admin and doesnt have permission to delete messages
      res.redirect('/talk-board')
    })

}
