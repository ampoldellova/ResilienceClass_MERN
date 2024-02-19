const cloudinary = require('cloudinary');
const Post = require('../models/post');
const user = require('../models/user');
// const Class = require('../models/class');
const Class = require('../models/class')

exports.newPost = async (req, res, next) => {

    req.body.teacher = req.user._id;

    let attachments = []

    if (req.files) {
        if (typeof req.files === 'string') {
            attachments.push(req.body.attachments)
        } else {
            attachments = req.files
        }

        let attachmentsLinks = [];

        for (let i = 0; i < attachments.length; i++) {
            let attachmentsDataUri = attachments[i].path

            try {
                const result = await cloudinary.v2.uploader.upload(`${attachmentsDataUri}`, {
                    folder: 'ResilienceClass/Posts',
                    crop: "scale",
                    resource_type: 'auto'
                });

                attachmentsLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url
                })

            } catch (error) {
                console.log(error)
            }
        }

        req.body.attachments = attachmentsLinks
    }

    console.log(req.body)
    const post = await Post.create(req.body);

    res.status(200).json({
        success: true,
        post: post,
        message: 'Post added'
    })
}

exports.updatePost = async (req, res, next) => {
    let post = await Post.findById(req.params.id)
    const newPostData = {
        contents: req.body.contents
    }

    console.log(req.body)
    if (!post) {
        return res.status(404).json({
            success: false,
            message: 'Post not found'
        })
    }

    let attachmentsLinks = [];

    if (req.files?.length > 0) {
        let attachments = req.files;
        for (let i = 0; i < attachments.length; i++) {
            let attachmentsDataUri = attachments[i].path;

            try {
                const result = await cloudinary.uploader.upload(attachmentsDataUri, {
                    folder: 'ResilienceClass/Posts',
                    crop: "scale",
                    resource_type: 'auto'
                });

                attachmentsLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url
                });

            } catch (error) {
                console.error(error);
            }
        }
        // post.attachments = attachmentsLinks;
        newPostData.attachments = attachmentsLinks
    }

    post = await Post.findByIdAndUpdate(req.params.id, newPostData, {
        new: true,
        runValidators: true,
        useFindandModify: false
    })

    return res.status(200).json({
        success: true,
        post
    })
};

exports.getAllPosts = async (req, res, next) => {
    const post = await Post.find({ class: req.params.id }).populate({
        path: 'teacher',
        model: user
    }).populate({
        path: 'comments.user',
        model: user
    })

    res.status(200).json({
        success: true,
        post
    })
}

exports.getSinglePost = async (req, res, next) => {
    const post = await Post.findById(req.params.id)

    if (!post) {
        return res.status(404).json({
            success: false,
            message: 'Post not found'
        })
    }
    res.status(200).json({
        success: true,
        post
    })
}

exports.createComment = async (req, res, next) => {
    try {

        const post = await Post.findById(req.params.id);

        req.body.user = req.user._id
        req.body.body = req.body.comment

        post.comments.push(req.body)

        post.save()


        res.status(200).json({
            success: true,
            post: post
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false
        })
    }
}

exports.deletePost = async (req, res, next) => {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
        return res.status(404).json({
            success: false,
            message: 'Post not found'
        })
    }

    res.status(200).json({
        success: true,
        message: 'Post deleted'
    })
}