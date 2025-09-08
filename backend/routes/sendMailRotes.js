const express = require('express');
const { Emailhandler } = require('../utils/sendEmail');


const router = express.Router();

router.route('/sendEmail').post(Emailhandler);

module.exports = router;