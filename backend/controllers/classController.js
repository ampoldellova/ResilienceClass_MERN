const Class = require('../models/class');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary');
const generateString = require('../utils/codeGenerator')
const user = require('../models/user');

exports.newClass = async (req, res, next) => {
    // console.log(req.user)
    const randomCode = generateString(6);
    req.body.classCode = randomCode.trim();
    req.body.joinedUsers = {
        user: []
    };
    req.body.joinedUsers.user.push(req.user._id);
    req.body.joinedUsers.role = 'teacher';

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

exports.updateClass = async (req, res, next) => {
    let classRoom = await Class.findById(req.params.id)
    const newClassData = {
        className: req.body.className,
        section: req.body.section,
        subject: req.body.subject,
        roomNumber: req.body.roomNumber,
    }

    // console.log(req.body)
    if (!classRoom) {
        return res.status(404).json({
            success: false,
            message: 'Class not found'
        })
    }

    if (req.file) {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: 'ResilienceClass/classCoverPhotos',
            crop: "scale"
        })

        newClassData.coverPhoto = {
            public_id: result.public_id,
            url: result.secure_url
        }
    }

    classRoom = await Class.findByIdAndUpdate(req.params.id, newClassData, {
        new: true,
        runValidators: true,
        useFindandModify: false
    })

    return res.status(200).json({
        success: true,
        classRoom
    })
}

exports.userClasses = async (req, res, next) => {

    const classRoom = await Class.find();
    // let classes = []

    const classes = classRoom.filter(classOne => {
        for (let index = 0; index < classOne.joinedUsers.length; index++) {
            if (classOne.joinedUsers[index].user.toString() == req.user._id.toString()) {
                return classOne
            }
        }
    })
    res.json({
        classRoom: classes
    })

}

exports.getSingleClass = async (req, res, next) => {
    const classRoom = await Class.findById(req.params.id)

    if (!classRoom) {
        return res.status(404).json({
            success: false,
            message: 'Classroom not found'
        })
    }
    res.status(200).json({
        success: true,
        classRoom: classRoom
    })
}

exports.getClassMembers = async (req, res, next) => {
    const classRoom = await Class.findById(req.params.id).populate({
        path: 'joinedUsers.user',
        model: user
    })

    if (!classRoom) {
        return res.status(404).json({
            success: false,
            message: 'Class Members not found'
        })
    }

    res.status(200).json({
        success: true,
        classMembers: classRoom.joinedUsers
    })
}

exports.joinClass = async (req, res, next) => {
    const { enteredCode } = req.body;

    try {
        const foundClass = await Class.findOne({ classCode: enteredCode });
        // console.log(foundClass)
        if (!foundClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        const isUserJoined = foundClass.joinedUsers.some(user => user.user.toString() === req.user._id);
        if (isUserJoined) {
            return res.status(400).json({ message: "User already joined the class." });
        }

        foundClass.joinedUsers.push({ user: req.user._id, role: 'student' });

        await foundClass.save();

        res.status(200).json({ message: "User joined the class successfully." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error." });
    }
}