const jwt = require("jsonwebtoken");
const mdbConn = require('../db_connection/mariaDBConn')
require("dotenv").config();

function generateAccessToken(payload, expire = 3600){ //access 토큰 발급
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { 
        expiresIn: expire 
    });
}
function generateRefreshToken(payload, expire = 86400){ //refresh 토큰 발급
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: expire 
    });
}
function generateuuidv4(num = 16) {
    if (num == 10){
        return 'xxxxyxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    else{
        return 'xxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
function getTokenChk(token, value) {
    try {
        let secret;
        let TOKEN;

        if (token.slice(0,7) == "Bearer "){
            TOKEN = token.slice(7)
        } else{
            TOKEN = token
        }
        
        if (value == 'access') {
            secret = process.env.ACCESS_TOKEN_SECRET
        } else {
            secret = process.env.REFRESH_TOKEN_SECRET
        }
        // console.log("안녕",TOKEN)
        const tokenVal =  jwt.verify(TOKEN, secret);
        return "valid";
    } catch (err) {
        console.log(err)
        return "invalid"
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
    checkTokens : checkTokens,
    generateuuidv4 : generateuuidv4
}