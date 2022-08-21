var express = require('express');
var router = express.Router();

// require controller modules
const indexController = require('../controllers/index-controller');

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', indexController.home);

router.get('/talk-board', indexController.talkBoard_get);

router.get('/shop', indexController.shop);

router.get('/membership', indexController.membership);

router.get('/cart', indexController.cart);



module.exports = router;
