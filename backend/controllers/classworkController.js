const cloudinary = require('cloudinary');
const Classwork = require('../models/classwork');
const user = require('../models/user');

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

exports.getClassworks = async (req, res, next) => {
    const classwork = await Classwork.find({ class: req.params.id })

    res.status(200).json({
        success: true,
        classwork
    })
}

exports.getSingleClasswork = async (req, res, next) => {
    const classwork = await Classwork.findById(req.params.id).populate({
        path: 'teacher',
        model: user
    })

    if (!classwork) {
        return res.status(404).json({
            success: false,
            message: 'Classwork not found'
        })
    }
    res.status(200).json({
        success: true,
        classwork
    })
}

exports.attachFile = async (req, res, next) => {
    try {
        const classwork = await Classwork.findById(req.params.id);

        req.body.user = req.user._id;

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

        classwork.submissions.push(req.body)
        classwork.save()

        res.status(200).json({
            success: true,
            classwork: classwork
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false
        })
    }
}
