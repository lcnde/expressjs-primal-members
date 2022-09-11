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

// SHOP
// list products
router.get('/shop', indexController.shop);

// see product page
router.get('/product/:name/:id/:option', indexController.product_detail);

// see cart page
router.get('/cart', indexController.cart_get);

// add product to cart
router.post('/add-to-cart', indexController.cart_post);




// TALKBOARD
router.get('/talk-board', messageController.talkBoard_get);

router.post('/message-post', messageController.message_post);

router.post('/message-delete', messageController.message_delete_post);


// MEMBERSHIP
router.get('/membership', indexController.membership);

router.post('/membership-join', indexController.membership_join);

router.post('/membership-delete', indexController.membership_delete)



module.exports = router;
