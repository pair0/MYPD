const passport = require('passport');
// const local = require('./localStrategy'); // 로컬서버로 로그인할때
const kakao = require('./kakaoStrategy'); // 카카오서버로 로그인할때
const mdbConn = require('../db_connection/mariaDBConn');
const naver = require('./naverStrategy');
const google = require('./googleStrategy');


passport.serializeUser((user, done) => {
  done(null, { 
    id :user.e_customer_id, 
    accessToken:user.accessToken});
});

passport.deserializeUser((user, done) => {
    //? 두번 inner 조인해서 나를 팔로우하는 followerid와 내가 팔로우 하는 followingid를 가져와 테이블을 붙인다
    var sql = `SELECT * FROM Customers_Enterprise WHERE e_customer_id = ?;`
    var params = [user.id]
    mdbConn.dbSelect(sql, params)
    .then(rows => {
      let result = rows
      result.accessToken = user.accessToken
      done(null, result)
    })
    .catch(error => done(null,false))
  });
  // local();
  kakao(); // 구글 전략 등록
  naver();
  google();