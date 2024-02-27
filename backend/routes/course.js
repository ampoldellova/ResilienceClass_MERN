const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { newCourse, getAllCourses, getSingleCourse } = require('../controllers/courseController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.post('/course/new', isAuthenticatedUser, upload.array('contents'), newCourse);
router.get('/courses', isAuthenticatedUser, getAllCourses);
router.get('/course/:id', isAuthenticatedUser, getSingleCourse);

module.exports = router;