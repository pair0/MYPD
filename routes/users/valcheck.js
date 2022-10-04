
const { validationResult} = require("express-validator");

exports.validatorErrorChecker = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.status(400).json({ errors: errors.array() });
        return res.redirect('/user/join');
    }
    next();
}