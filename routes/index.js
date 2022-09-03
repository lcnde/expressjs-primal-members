var express = require('express');
var router = express.Router();

// require controller modules
const indexController = require('../controllers/index-controller');
const messageController = require('../controllers/message-controller');

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', indexController.home);

router.get('/shop', indexController.shop);

router.get('/membership', indexController.membership);

router.get('/cart', indexController.cart);


// talkboard routes
router.get('/talk-board', messageController.talkBoard_get);

router.post('/message-post', messageController.message_post);

router.post('/message-delete', messageController.message_delete_post);



module.exports = router;
