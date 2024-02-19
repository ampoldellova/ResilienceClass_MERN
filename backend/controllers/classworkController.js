const cloudinary = require('cloudinary');
const Classwork = require('../models/classwork');

exports.newClasswork = async (req, res, next) => {
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
                    folder: 'ResilienceClass/Classworks',
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
    const classwork = await Classwork.create(req.body);

    res.status(200).json({
        success: true,
        classwork: classwork,
        message: 'Classwork added'
    })
}