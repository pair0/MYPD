var express = require('express')
var router = express.Router();
const { isLogIn }= require('../auth/auth')


/* GET home page. */
router.get('/', isLogIn, function(req, res, next) {
  res.render('test');
});


module.exports = router;