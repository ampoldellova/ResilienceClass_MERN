const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { registerUser, loginUser, forgotPassword, logout, getUserProfile, updateProfile, getAllUsers, deleteUser } = require('../controllers/authController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

router.post('/register', upload.single("avatar"), registerUser);
router.post('/login', loginUser);
router.get('/logout', logout);
router.post('/password/forgot', forgotPassword);
router.get('/me', isAuthenticatedUser, getUserProfile);
router.put('/me/update', isAuthenticatedUser, upload.single("avatar"), updateProfile);
router.get('/admin/users', isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);
router.delete('/admin/user/delete/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

module.exports = router;