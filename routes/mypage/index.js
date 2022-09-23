var express = require('express')
const mdbConn = require('../../db_connection/mariaDBConn')
var router = express.Router();


/* GET home page. */
router.get('/edit', function(req, res, next) {
  res.render('edit');
});


module.exports = router;

