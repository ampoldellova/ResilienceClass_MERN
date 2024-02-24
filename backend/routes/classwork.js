const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { newClasswork, getClassworks, getSingleClasswork, attachFile, removeFile, submitClasswork, unsubmitClasswork } = require('../controllers/classworkController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.post('/class/classwork/new', isAuthenticatedUser, upload.array('attachments'), newClasswork);
router.get('/class/classworks/:id', isAuthenticatedUser, getClassworks);
router.get('/class/classwork/:id', isAuthenticatedUser, getSingleClasswork);
router.post('/class/classwork/:id/attach', isAuthenticatedUser, upload.array('attachments'), attachFile);
router.delete('/class/classwork/file/remove/:id', isAuthenticatedUser, removeFile);
router.get('/class/classwork/:id/submit', isAuthenticatedUser, submitClasswork);
router.get('/class/classwork/:id/unsubmit', isAuthenticatedUser, unsubmitClasswork);

module.exports = router;