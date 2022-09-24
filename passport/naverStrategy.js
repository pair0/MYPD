const passport = require('passport');
const { Strategy: NaverStrategy } = require('passport-naver-v2');
const mdbConn = require('../db_connection/mariaDBConn')
require('dotenv').config();


module.exports = () => {
    passport.use(
    new NaverStrategy({
        clientID: process.env.NAVER_ID,
        clientSecret: process.env.NAVER_SECRET,
        callbackURL: '/auth/naver/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            // console.log('naver profile : ', profile);
            try{
                let info = {
                "enterprise_number" : "NULL",
                "e_customer_id" : profile.id,
                "nickname" : profile.name,
                "e_customer_email" : profile.email,
                "snsID" : "naver",
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