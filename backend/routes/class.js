const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { newClass, getClass, userClasses } = require('../controllers/classController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.post('/class/new', isAuthenticatedUser, newClass);
router.get('/', isAuthenticatedUser, getClass);
router.get('/class/user', isAuthenticatedUser, userClasses);

module.exports = router;