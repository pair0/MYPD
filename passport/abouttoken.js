const jwt = require("jsonwebtoken");
const mdbConn = require('../db_connection/mariaDBConn')
require("dotenv").config();

function generateAccessToken(payload){ //access 토큰 발급
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { 
        algorithm: 'HS256',
        expiresIn: 3600 
    });
}
function generateRefreshToken(payload){ //refresh 토큰 발급
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: 86400 });
}
function getTokenChk(token, value) {
    try {
        let secret;
        let TOKEN = token.slice(7)
        if (value == 'access') {
            secret = process.env.ACCESS_TOKEN_SECRET
        } else {
            secret = process.env.REFRESH_TOKEN_SECRET
        }
        const tokenVal =  jwt.verify(TOKEN, secret);
        return tokenVal;
    } catch (err) {
        console.log(err)
    }
}
function authenticateToken (req,res,next){
    const token = req.session.passport.user.accessToken.slice(7)
    if(req.session.joinUser.snsID !== null) return next();
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
        if(error) return res.redirect('/user/login')
        next();
    })
}
async function checkTokens(req, res, next){
    let user = req.session;
    if (req.session.joinUser.snsID !== null) return next();

    const accessToken = getTokenChk(user.passport.user.accessToken, 'access')
    var sql = "SELECT refresh_token FROM Customers_Enterprise WHERE refresh_token = ? ;"
    var params = [
        user.joinUser.refreshToken
    ]
    mdbConn.dbSelect(sql, params)

    const refreshToken = getTokenChk(user.joinUser.refreshToken, 'refresh')
            if(accessToken == null) {
                if (refreshToken === undefined) {
                    return res.redirect('/user/login')
                } else {
                    const payload = {
                        idx : rows.id_idx
                    };
                    const newAccessToken = generateAccessToken(payload)
                    req.session.passport.user.accessToken = 'Bearer ' + newAccessToken;
                    next();
                }
            }else {
                if (refreshToken === undefined) {
                    const newRefreshToken = generateRefreshToken(payload);
                    var sql = "UPDATE Customers_Enterprise SET refresh_token = ?  WHERE e_customer_id = ?";
                    var params = [newRefreshToken, user.passport.user.id];
                    mdbConn.dbInsert(sql, params)
                    .then((rows) => {
                        req.session.passport.joinUser.refreshToken = 'Bearer ' + newRefreshToken;
                        next();
                    })
                    .catch((errMsg) => {
                        console.log(errMsg);
                    });
                } else {
                    next();
                }
            }
}
module.exports = {
    generateAccessToken : generateAccessToken,
    generateRefreshToken : generateRefreshToken,
    getTokenChk : getTokenChk,
    authenticateToken : authenticateToken,
    checkTokens : checkTokens
}