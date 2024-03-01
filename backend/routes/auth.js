const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { registerUser, loginUser, forgotPassword, logout, getUserProfile, updateProfile } = require('../controllers/authController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.post('/register', upload.single("avatar"), registerUser);
router.post('/login', loginUser);
router.get('/logout', logout);
router.post('/password/forgot', forgotPassword);
router.get('/me', isAuthenticatedUser, getUserProfile);
router.put('/me/update', isAuthenticatedUser, upload.single("avatar"), updateProfile);

module.exports = router;