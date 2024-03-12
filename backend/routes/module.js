const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const Module = require('../models/module');

const { newModule, getAllModules, getSingleModule, softDeleteModule, getAllArchivedModules, restoreModule, deleteModule } = require('../controllers/moduleController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.post('/module/new', isAuthenticatedUser, upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'contents', maxCount: 1 }
]), newModule);
router.get('/modules', isAuthenticatedUser, getAllModules);
router.get('/module/:id', isAuthenticatedUser, getSingleModule);
router.get('/admin/modules', isAuthenticatedUser, authorizeRoles('admin'), getAllModules);
router.get('/admin/archive/modules', isAuthenticatedUser, authorizeRoles('admin'), getAllArchivedModules);
router.delete('/admin/module/delete/:id', isAuthenticatedUser, authorizeRoles('admin'), softDeleteModule);
router.delete('/admin/module/delete/force/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteModule);
router.put('/admin/module/restore/:id', isAuthenticatedUser, authorizeRoles('admin'), restoreModule);
router.get('/admin/module-categories', async (req, res) => {
    try {
        const categories = await Module.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $project: { category: '$_id', count: 1, _id: 0 } }
        ]);
        res.json({ categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;