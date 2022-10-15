const router = require("express").Router()
const oauth = require("./oauth");
const specification = require("./specification");
const diagnosis = require("./diagnosis")
const pharmacy = require("./pharmacy")

router.use('/oauth', oauth);
router.use('/specification', specification);
router.use('/diagnosis', diagnosis);
router.use('/pharmacy', pharmacy);


module.exports = router;
