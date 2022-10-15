const router = require("express").Router()
const authorize_api = require('./authorize_api')
const token_api = require('./token_api')

router.use('/authorize_api', authorize_api);
router.use('/token_api', token_api);

module.exports = router
