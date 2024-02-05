const Class = require('../models/class');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary');
const generateString = require('../utils/codeGenerator')

exports.newClass = async (req, res, next) => {
    console.log(req.user)
    const randomCode = generateString(6);
    req.body.classCode = randomCode;
    req.body.joinedUsers = {
        user: []
    };
    req.body.joinedUsers.user.push(req.user._id);


    const classRoom = await Class.create(req.body);
    if (!classRoom)
        return res.status(400).json({
            success: false,
            message: 'Classroom has not been created'
        })

    res.status(201).json({
        success: true,
        classRoom
    })
}

exports.getClass = async (req, res, next) => {

    const classRoom = await Class.find();

    res.status(200).json({
        success: true,
        classRoom
    })
}