var express = require('express');
var router = express.Router();

// require controller modules
const indexController = require('../controllers/index-controller');

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', indexController.index);

module.exports = router;
