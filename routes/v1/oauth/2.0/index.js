const router = require("express").Router()
const token = require('./token')
router.use('/token', token);

module.exports = router
