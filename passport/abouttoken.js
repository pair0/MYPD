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

// access 토큰 및 refresh 토큰 검증
async function checkTokens(req, res, next){
    let user = req.session;
    if (req.session.joinUser.snsID !== null) return next();   // sns 로그인일 경우 토큰 확인 pass (Router에서 isLogin으로 accessToken 확인해줌)

    const accessToken = getTokenChk(user.passport.user.accessToken, 'access')   // access 토큰 verify
    var sql = "SELECT refresh_token FROM Customers_Enterprise WHERE refresh_token = ? ;"
    var params = [
        user.joinUser.refreshToken
    ]
    mdbConn.dbSelect(sql, params)
    .then((row) => {
            const refreshToken = getTokenChk(user.joinUser.refreshToken, 'refresh')
            if(accessToken == null) {
                if (refreshToken === undefined) {
                    return res.redirect('/user/login')
                } else {
                    const payload = {
                        idx : row.id_idx
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
                    .then((row) => {
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
    
    )


}
module.exports = {
    generateAccessToken : generateAccessToken,
    generateRefreshToken : generateRefreshToken,
    getTokenChk : getTokenChk,
    // authenticateToken : authenticateToken,
    checkTokens : checkTokens
}