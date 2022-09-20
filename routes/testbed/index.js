var express = require('express')
const mdbConn = require('../../db_connection/mariaDBConn')
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('test');
});


module.exports = router;