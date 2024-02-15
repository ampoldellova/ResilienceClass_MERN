const Class = require('../models/class');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary');
const generateString = require('../utils/codeGenerator')

exports.newPost = async (req, res, next) => {

    req.body.class.push(req.class._id);
    let attachments = []
    if (typeof req.body.attachments === 'string') {
        attachments.push(req.body.attachments)
    } else {
        attachments = req.body.attachments.flat()
    }

    let attachmentsLinks = [];

    for (let i = 0; i < attachments.length; i++) {
        let attachmentsDataUri = attachments[i]

        try {
            const result = await cloudinary.v2.uploader.upload(`${attachmentsDataUri}`, {
                folder: 'ResilienceClass/Posts',
                crop: "scale",
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