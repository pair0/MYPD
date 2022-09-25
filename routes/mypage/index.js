var express = require('express')
const mdbConn = require('../../db_connection/mariaDBConn')
const bcrypt = require('bcrypt');
var router = express.Router();


/* GET home page. */
router.get('/editcheck', function(req, res, next) {
  res.render('editcheck');
});

router.post('/editcheck', async function(req, res, next){
  console.log(req.session.passport.user.id);
  var sql = "SELECT * FROM Customers_Enterprise WHERE e_customer_id=?";
  var params = req.session.passport.user.id;
  var result = await mdbConn.dbSelect(sql, params);
  console.log(result);
  bcrypt.compare(req.body.pw_Check, result.e_customer_pw, (err, same) => {
    if(!same){
      res.send(`<script>alert('패스워드가 맞지 않습니다.');location.replace("/mypage/editcheck")</script>`);
    } else{
     res.redirect('/mypage/edit'); 
    };
  });
});

router.get('/edit', function(req, res, next) {
  res.render('edit');
});

module.exports = router;