const Course = require('../models/course');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary');

exports.newCourse = async (req, res, next) => {
    req.body.creator = req.user._id

    if (req.file) {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: 'ResilienceClass/CourseImages',
            crop: "scale"
        })

        req.body.coverPhoto = {
            public_id: result.public_id,
            url: result.secure_url
        }
    }

    let contents = []

    if (req.files) {
        if (typeof req.files === 'string') {
            contents.push(req.body.contents)
        } else {
            contents = req.files
        }

        let contentsLinks = [];

        for (let i = 0; i < contents.length; i++) {
            let contentsDataUri = contents[i].path

            try {
                const result = await cloudinary.v2.uploader.upload(`${contentsDataUri}`, {
                    folder: 'ResilienceClass/Courses',
                    crop: "scale",
                    resource_type: 'auto'
                });

                contentsLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url
                })

            } catch (error) {
                console.log(error)
            }
        }
        req.body.contents = contentsLinks
    }

    console.log(req.body)
    const courses = await Course.create(req.body);

    res.status(200).json({
        success: true,
        courses: courses,
        message: 'Course added'
    })
}

exports.getAllCourses = async (req, res, next) => {
    const courses = await Course.find();

    res.status(200).json({
        success: true,
        courses
    })
}