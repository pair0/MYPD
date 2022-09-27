require("dotenv").config();
const jwt = require("jsonwebtoken");
module.exports = {
    generateAccessToken : function(payload){
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
    },
    generateRefreshToken : function(payload){
        return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: 86400 });
    },
    getTokenChk : async function(token, value) {
        try {
            let secret;
            if (value === 'access') {
                secret = process.env.ACCESS_TOKEN_SECRET
            } else {
                secret = process.env.REFRESH_TOKEN_SECRET
            }
            const tokenVal = await jwt.verify(token, secret);
    
    
            return tokenVal;
        } catch (err) {
            logger.error(err);
            logger.error("Token Verify Error");
            return false;
        }
    },
    // 토큰 재발급, 쿠키 숨기기 등등
    authenticateToken : function (req,res,next){
        const token = req.cookies.accessToken.slice(7)
        if(token == null) return res.sendState(401)
        jwt.verify(token, process.env.ACCESS_TOKERN_SECRET, (error, payload) => {
        if(error) return res.redirect('/user/login')
        next();
        })
    },
    checkTokens : async function(req, res, next){
        let user = req.session;
        if (user.passport.user.access === undefined) throw Error('API 사용 권한이 없습니다.'); 
        const accessToken = jwt.verify(user.passport.user.access, process.env.ACCESS_TOKERN_SECRET);

        var sql = `SELECT refreshToken FROM Customers_Enterprise WHERE refreshToken = ? ;`
        var params = [
            user.joinUser.refreshToken
        ]
        mdbConn.dbSelect(sql, params)
        .then((rows ,req, res) => {
            if(rows){
                const refreshToken = jwt.verify(user.passport.user.access, process.env.REFRESH_TOKERN_SECRET);
                if(accessToken == null) {
                    if (refreshToken === undefined) {
                        return res.redirect('/user/login')
                    } else {
                        const payload = {
                            idx : rows.id_idx
                        };
                        const newAccessToken = generateAccessToken(payload);
                        
                    }
                }
            }
        })
    }
}