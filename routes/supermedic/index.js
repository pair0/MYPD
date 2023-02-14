var express = require('express')
const mdbConn = require('../../db_connection/mariaDBConn')
var router = express.Router();


router.get('/', function(req, res, next) {
    res.render('supermedic');
  });
  
  
module.exports = router;