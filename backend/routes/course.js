const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { newCourse, getAllCourses } = require('../controllers/courseController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.post('/course/new', isAuthenticatedUser, upload.array('contents'), newCourse);
router.get('/courses', isAuthenticatedUser, getAllCourses);

module.exports = router;