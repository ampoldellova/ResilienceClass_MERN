const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { newClass, getClass } = require('../controllers/classController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.post('/class/new', isAuthenticatedUser, newClass);
router.get('/', isAuthenticatedUser, getClass);

module.exports = router;