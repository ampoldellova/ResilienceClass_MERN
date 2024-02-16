const Class = require('../models/class');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary');
const generateString = require('../utils/codeGenerator');
const Post = require('../models/post');

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

exports.getAllPosts = async (req, res, next) => {
    const post = await Post.find({ class: req.params.id });

    res.status(200).json({
        success: true,
        post
    })
}