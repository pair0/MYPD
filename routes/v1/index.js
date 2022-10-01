const router = require("express").Router()
const oauth = require("./oauth");
router.use('/oauth', oauth);
module.exports = router;
