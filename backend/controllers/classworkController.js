const cloudinary = require('cloudinary');
const Classwork = require('../models/classwork');
const user = require('../models/user');
const Class = require('../models/class');

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
};

exports.getClassworks = async (req, res, next) => {
    const classwork = await Classwork.find({ class: req.params.id })

    res.status(200).json({
        success: true,
        classwork
    })
};

exports.getSingleClasswork = async (req, res, next) => {
    const classwork = await Classwork.findById(req.params.id).populate({
        path: 'teacher',
        model: user
    }).populate({
        path: 'submissions.user',
        model: user
    }).populate({
        path: 'class',
        model: Class
    })

    const submission = classwork.submissions.find(obj => obj.user._id.toString() === req.user._id.toString());
    console.log(submission)
    if (!classwork) {
        return res.status(404).json({
            success: false,
            message: 'Classwork not found'
        })
    }

    res.status(200).json({
        success: true,
        classwork,
        submission
    })
};

exports.attachFile = async (req, res, next) => {
    try {
        const classwork = await Classwork.findById(req.params.id);
        console.log(req.body)
        req.body.user = req.user._id;
        console.log(req.files)
        let attachmentsLinks = [];
        if (req.files) {
            if (typeof req.files === 'string') {
                attachments.push(req.body.attachments)
            } else {
                attachments = req.files
            }

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

        const submission = classwork.submissions.find(obj => obj.user._id.toString() === req.user._id.toString());

        if (submission) {
            classwork.submissions.find(obj => obj.user._id.toString() === req.user._id.toString()).attachments.push(...attachmentsLinks)
        } else {
            classwork.submissions.push(req.body)
        }
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
};

exports.removeFile = async (req, res, next) => {
    try {
        console.log(req.params.id);
        console.log(req.query.publicId);

        const classwork = await Classwork.findById(req.params.id);

        const submission = classwork.submissions.find(obj => obj.user.toString() === req.user._id.toString());
        const filteredSubmmision = submission.attachments.filter(obj => obj.public_id !== req.query.publicId);
        classwork.submissions.find(obj => obj.user.toString() === req.user._id.toString()).attachments = filteredSubmmision
        classwork.save();

        res.status(200).json({
            success: true,
            classwork: classwork
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.updateClasswork = async (req, res, next) => {
    let classwork = await Classwork.findById(req.params.id)
    // console.log(req.body)
    const newClassworkData = {
        title: req.body.title,
        instructions: req.body.instructions,
        points: req.body.points,
        deadline: req.body.deadline
    }

    if (req.body.points === 'null') {
        delete newClassworkData.points
    }

    if (req.body.deadline === 'null') {
        delete newClassworkData.deadline
    }

    if (!classwork) {
        return res.status(404).json({
            success: false,
            message: 'Classwork not found'
        })
    }

    let attachmentsLinks = [];

    if (req.files?.length > 0) {
        let attachments = req.files;
        for (let i = 0; i < attachments.length; i++) {
            let attachmentsDataUri = attachments[i].path;

            try {
                const result = await cloudinary.uploader.upload(attachmentsDataUri, {
                    folder: 'ResilienceClass/Classwork',
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
        newClassworkData.attachments = attachmentsLinks
    }

    classwork = await Classwork.findByIdAndUpdate(req.params.id, newClassworkData, {
        new: true,
        runValidators: true,
        useFindandModify: false
    })

    return res.status(200).json({
        success: true,
        classwork
    })
};

exports.submitClasswork = async (req, res, next) => {
    try {
        const classwork = await Classwork.findById(req.params.id);
        classwork.submissions.find(obj => obj.user.toString() === req.user._id.toString()).submittedAt = new Date();
        classwork.submissions.find(obj => obj.user.toString() === req.user._id.toString()).status = 'Submitted';
        classwork.save();

        res.status(200).json({
            success: true,
            classwork: classwork
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false
        });
    }
};

exports.unsubmitClasswork = async (req, res, next) => {
    try {
        const classwork = await Classwork.findById(req.params.id);
        classwork.submissions.find(obj => obj.user.toString() === req.user._id.toString()).submittedAt = null;
        classwork.submissions.find(obj => obj.user.toString() === req.user._id.toString()).status = 'Not submitted';
        classwork.submissions.find(obj => obj.user.toString() === req.user._id.toString()).grades = null;
        classwork.save();

        res.status(200).json({
            success: true,
            classwork: classwork
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false
        });
    }
};

exports.deleteClasswork = async (req, res, next) => {
    const classwork = await Classwork.findByIdAndDelete(req.params.id);
    if (!classwork) {
        return res.status(404).json({
            success: false,
            message: 'Classwork not found'
        })
    }

    res.status(200).json({
        success: true,
        message: 'Classwork deleted'
    })
};

exports.returnClasswork = async (req, res, next) => {

    try {
        const classwork = await Classwork.findById(req.params.id);

        classwork.submissions.find(obj => obj.user.toString() === req.query.studentId).grades = Number.parseInt(req.query.grades);
        classwork.submissions.find(obj => obj.user.toString() === req.query.studentId).status = "Graded";
        classwork.save();

        res.status(200).json({
            success: true,
            classwork: classwork
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false
        });
    }
};

exports.getAllClassworks = async (req, res, next) => {
    const classworks = await Classwork.find().populate({
        path: 'teacher',
        model: user
    }).populate({
        path: 'submissions.user',
        model: user
    }).populate({
        path: 'class',
        model: Class
    })

    res.status(200).json({
        success: true,
        classworks: classworks
    })
};