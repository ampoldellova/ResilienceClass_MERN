const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { newClass, userClasses, getSingleClass, joinClass, updateClass } = require('../controllers/classController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.post('/class/new', isAuthenticatedUser, newClass);
router.get('/class/user', isAuthenticatedUser, userClasses);
router.get('/class/:id', isAuthenticatedUser, getSingleClass);
router.post('/class/join', isAuthenticatedUser, joinClass);
router.put('/class/update/:id', upload.single("coverPhoto"), updateClass);

module.exports = router;