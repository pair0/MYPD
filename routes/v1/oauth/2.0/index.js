const router = require("express").Router()
const token = require('./token')
const authorize = require('./authorize')

router.use('/token', token);
router.use('/authorize', authorize);

module.exports = router
