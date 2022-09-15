var express = require('express')
const mdbConn = require('../../db_connection/mariaDBConn')
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home');
});

router.get("/servicemanage", function (req, res, next) { //home(리스트)
  res.render("servicemanage"); // home.ejs 파일로 가라
});


router.get("/send", async function (req, res) { //db_test
  mdbConn.getUserList('jsman', 'user')
    .then((rows) => {
      console.log(rows);
    })
    .catch((errMsg) => {
      console.log(errMsg);
    });
})


module.exports = router;
