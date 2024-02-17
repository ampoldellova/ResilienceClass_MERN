const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { newPost, getAllPosts, createComment } = require('../controllers/postController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.post('/class/post/new', isAuthenticatedUser, upload.array('attachments'), newPost);
router.post('/class/post/:id/comment', isAuthenticatedUser, upload.array('attachments'), createComment);
router.get('/class/post/:id', isAuthenticatedUser, getAllPosts);

module.exports = router;