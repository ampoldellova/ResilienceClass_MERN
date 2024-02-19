const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { newClasswork } = require('../controllers/classworkController');

router.post('/class/classwork/new', isAuthenticatedUser, upload.array('attachments'), newClasswork);

module.exports = router;