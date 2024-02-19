const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { newPost, getAllPosts, createComment, updatePost, getSinglePost, deletePost } = require('../controllers/postController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.post('/class/post/new', isAuthenticatedUser, upload.array('attachments'), newPost);
router.put('/class/post/update/:id', isAuthenticatedUser, upload.array('attachments'), updatePost);
router.post('/class/post/:id/comment', isAuthenticatedUser, upload.array('attachments'), createComment);
router.get('/class/post/:id', isAuthenticatedUser, getAllPosts);
router.get('/class/post/details/:id', isAuthenticatedUser, getSinglePost);
router.delete('/class/post/:id', isAuthenticatedUser, deletePost);

module.exports = router;