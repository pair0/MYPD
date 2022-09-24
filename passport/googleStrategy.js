const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mdbConn = require('../db_connection/mariaDBConn')
require('dotenv').config();

module.exports = () => {
    passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_ID, // 구글 로그인에서 발급받은 REST API 키
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: '/auth/google/callback', // 구글 로그인 Redirect URI 경로
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('google profile : ', profile);
        try{
            let info = {
            "enterprise_number" : "NULL",
            "e_customer_id" : profile.id,
            "nickname" : profile.displayName,
            "e_customer_email" : profile.emails[0].value,
            "snsID" : "google",
            accessToken : accessToken
            }
            console.log(info)
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