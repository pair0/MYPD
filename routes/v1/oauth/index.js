const router = require("express").Router()
const version_oauth = require("./2.0");
router.use('/2.0', version_oauth);
module.exports = router;
