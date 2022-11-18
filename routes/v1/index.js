const router = require("express").Router();
const oauth = require("./oauth");
const specification = require("./specification");
const diagnosis = require("./diagnosis");
const pharmacy = require("./pharmacy");
const users = require("./user");
const invest = require("./invest");

router.use("/oauth", oauth);
router.use("/specification", specification);
router.use("/diagnosis", diagnosis);
router.use("/pharmacy", pharmacy);
router.use("/", users);
router.use("/invest", invest);

module.exports = router;
