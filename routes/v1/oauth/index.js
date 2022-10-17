const router = require("express").Router()
const version_oauth = require("./2.0");
router.use('/2.0', version_oauth);
const version_oauth1 = require("./oauth_api");
router.use('/oauth_api', version_oauth1);
module.exports = router;
