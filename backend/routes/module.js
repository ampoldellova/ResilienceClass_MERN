const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { newModule, getAllModules, getSingleModule, deleteModule, moduleAnalytics } = require('../controllers/moduleController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.post('/module/new', isAuthenticatedUser, upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'contents', maxCount: 1 }
]), newModule);
router.get('/modules', isAuthenticatedUser, getAllModules);
router.get('/module/:id', isAuthenticatedUser, getSingleModule);
router.get('/admin/modules', isAuthenticatedUser, authorizeRoles('admin'), getAllModules);
router.delete('/admin/module/delete/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteModule);
router.get('/admin/module-categories', isAuthenticatedUser, authorizeRoles('admin'), moduleAnalytics);

module.exports = router;