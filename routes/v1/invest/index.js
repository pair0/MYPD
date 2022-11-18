const router = require("express").Router()

const accounts = require("./accounts");
router.use('/accounts', accounts);

module.exports = router;