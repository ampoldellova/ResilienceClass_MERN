const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { newClass } = require('../controllers/classController');

router.post('/class/new', newClass);

module.exports = router;