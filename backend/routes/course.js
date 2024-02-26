const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { newCourse, getAllCourses } = require('../controllers/courseController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.post('/course/new', isAuthenticatedUser, newCourse);
router.get('/courses', isAuthenticatedUser, getAllCourses);
