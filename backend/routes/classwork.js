const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { newClasswork, getClassworks, getSingleClasswork, attachFile, removeFile, submitClasswork, unsubmitClasswork, deleteClasswork, updateClasswork, returnClasswork, getAllClassworks } = require('../controllers/classworkController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

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
router.get('/admin/classworks', isAuthenticatedUser, authorizeRoles('admin'), getAllClassworks);
router.delete('/admin/class/classwork/delete/:id', isAuthenticatedUser, deleteClasswork);

module.exports = router;