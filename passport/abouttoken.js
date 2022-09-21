require("dotenv").config();
const jwt = require("jsonwebtoken");
module.exports = {
    generateAccessToken : function(payload){
        return jwt.sign(payload, process.env.ACCESS_TOKERN_SECRET, { expiresIn: '15s' });
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
    }
}