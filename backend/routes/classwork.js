const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { newClasswork, getClassworks, getSingleClasswork, attachFile } = require('../controllers/classworkController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.post('/class/classwork/new', isAuthenticatedUser, upload.array('attachments'), newClasswork);
router.get('/class/classworks/:id', isAuthenticatedUser, getClassworks);
router.get('/class/classwork/:id', isAuthenticatedUser, getSingleClasswork);
router.post('/class/classwork/:id/attach', isAuthenticatedUser, upload.array('attachments'), attachFile);

module.exports = router;