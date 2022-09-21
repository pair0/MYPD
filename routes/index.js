const express = require('express');
const router = express.Router();

const main = require('./main');
const user = require('./users');
const testbed = require('./testbed');
const about = require('./about');
const auth = require('./auth');
router.use('/main', main);
router.use('/user', user);
router.use('/testbed', testbed);
router.use('/about',about);
router.use('/auth',auth);

module.exports = router;