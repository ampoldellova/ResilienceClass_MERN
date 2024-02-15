const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const { newPost, getAllPosts} = require('../controllers/postController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.post('/class/post/new', upload.array('attachments'), newPost);
router.get('/class/post/:id', getAllPosts);

module.exports = router;