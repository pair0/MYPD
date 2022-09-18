
const { validationResult} = require("express-validator");
// const check = require('express-validator/check');

exports.validatorErrorChecker = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.status(400).json({ errors: errors.array() });
        return res.send(`<script>alert('악성 사용자 꺼저라 시발련아! ');location.replace("../../user/join")</script>`);   
    }
    next();
}