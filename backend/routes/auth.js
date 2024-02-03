const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { registerUser, loginUser, forgotPassword, logout } = require('../controllers/authController');

router.post('/register', upload.single("avatar"), registerUser);
router.post('/login', loginUser);
router.get('/logout', logout);
router.post('/password/forgot', forgotPassword);

module.exports = router;