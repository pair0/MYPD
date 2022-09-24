const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const mdbConn = require('../db_connection/mariaDBConn')
require('dotenv').config();

module.exports = () => {
    // DB에 없다면 DB에 넣어 자동으로 회원가입 && DB에 있다면 바로 로그인
    passport.use('kakao', new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',     // 위에서 설정한 Redirect URI
    }, (accessToken, refreshToken, profile, done) => {
    console.log('kakao profile', profile);
    try{
        let info = {
        "enterprise_number" : "NULL",
        "e_customer_id" : profile.id,
        "nickname" : profile._json.properties.nickname,
        "e_customer_email" : profile._json.kakao_account.email,
        "snsID" : "kakao",
        accessToken : accessToken
        }
        var sql = `SELECT enterprise_number, nickname, e_customer_id, e_customer_email, snsID FROM Customers_Enterprise WHERE e_customer_id = ? AND snsID = ? ;`
        var params = [
        info["e_customer_id"],
        info["snsID"]
        ]
        mdbConn.dbSelect(sql, params)
        .then((rows ,req, res) => {
        if(rows){
            rows.accessToken = accessToken;
            done(null, true, rows); 
        }else {
            sql = 'INSERT INTO Customers_Enterprise(enterprise_number, nickname, e_customer_id, e_customer_email, snsID) VALUES(?,?,?,?,?)';
            var params = [info["enterprise_number"],info["nickname"],info["e_customer_id"].toString(), info["e_customer_email"],info["snsID"]];
            mdbConn.dbInsert(sql, params)
            .then((rows) => {
            done(null,false, info); 
            })
            .catch((errMsg) => {
            console.log(errMsg);
            done(null, info); 
            });
        }
        })
    } catch (error){
        console.error(error);
        done(error);
    }
    }))

};