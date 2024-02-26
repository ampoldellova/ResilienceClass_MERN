const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { newClasswork, getClassworks, getSingleClasswork, attachFile, removeFile, submitClasswork, unsubmitClasswork, deleteClasswork, updateClasswork, returnClasswork } = require('../controllers/classworkController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.post('/class/classwork/new', isAuthenticatedUser, upload.array('attachments'), newClasswork);
router.get('/class/classworks/:id', isAuthenticatedUser, getClassworks);
router.get('/class/classwork/:id', isAuthenticatedUser, getSingleClasswork);
router.post('/class/classwork/:id/attach', isAuthenticatedUser, upload.array('attachments'), attachFile);
router.delete('/class/classwork/file/remove/:id', isAuthenticatedUser, removeFile);
router.get('/class/classwork/:id/submit', isAuthenticatedUser, submitClasswork);
router.get('/class/classwork/:id/unsubmit', isAuthenticatedUser, unsubmitClasswork);
router.put('/class/classwork/:id/update', isAuthenticatedUser, upload.array('attachments'), updateClasswork);
router.delete('/class/classwork/:id/delete', isAuthenticatedUser, deleteClasswork);
router.put('/class/classwork/:id/return', isAuthenticatedUser, returnClasswork);

module.exports = router;