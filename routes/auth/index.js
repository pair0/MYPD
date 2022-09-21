var express = require('express');
const router = express.Router();
var passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const mdbConn = require('../../db_connection/mariaDBConn')
require('dotenv').config();

// DB에 없다면 DB에 넣어 자동으로 회원가입 && DB에 있다면 바로 로그인
passport.use('kakao', new KakaoStrategy({
    clientID: process.env.KAKAO_ID,
    callbackURL: '/auth/kakao/callback',     // 위에서 설정한 Redirect URI
  }, (accessToken, refreshToken, profile, done) => {
    console.log('kakao profile', profile);
    try{
      let info = {
        "enterprise_num" : "NULL",
        "id" : profile.id,
        "email" : profile._json.kakao_account.email,
        "snsID" : "kakao"
      }
      var sql = `SELECT * FROM Customers_Enterprise WHERE e_customer_id = ? AND snsID = ? ;`
      var params = [
        info["id"],
        info["snsID"]
      ]
      mdbConn.dbSelect(sql, params)
      .then((rows) => {
        if(rows){
          done(null, rows); 
        }else {
          sql = 'INSERT INTO Customers_Enterprise(enterprise_number, e_customer_id, e_customer_email, snsID) VALUES(?,?,?,?)';
          var params = [info["enterprise_num"],info["id"].toString(), info["email"],info["snsID"]];
          console.log(params)
          mdbConn.dbInsert(sql, params)
          .then((rows) => {
            console.log(rows);
          })
          .catch((errMsg) => {
            console.log(errMsg);
          });
        }
        done(null, rows); 
      })
    } catch (error){
      console.error(error);
      done(error);
    }
    // console.log(accessToken);
    // console.log(refreshToken);
}))

//* 카카오로 로그인하기 라우터 ***********************
//? /kakao로 요청오면, 카카오 로그인 페이지로 가게 되고, 카카오 서버를 통해 카카오 로그인을 하게 되면, 다음 라우터로 요청한다.
router.get('/kakao', passport.authenticate('kakao'));

//? 위에서 카카오 서버 로그인이 되면, 카카오 redirect url 설정에 따라 이쪽 라우터로 오게 된다.
router.get(
  '/kakao/callback',
   //? 그리고 passport 로그인 전략에 의해 kakaoStrategy로 가서 카카오계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.
  passport.authenticate('kakao', {
      failureRedirect: '/main', // kakaoStrategy에서 실패한다면 실행
  }),
  // kakaoStrategy에서 성공한다면 콜백 실행
  (req, res) => {
    console.log("asdas");
    res.redirect('/main');
  },
);
module.exports = router;
