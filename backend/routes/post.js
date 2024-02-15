const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { newPost } = require('../controllers/postController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.post('/class/post/new', upload.array('attachments'), newPost);

module.exports = router;