const Class = require('../models/class');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary');
const generateString = require('../utils/codeGenerator')

exports.newClass = async (req, res, next) => {
    console.log(req.user)
    const randomCode = generateString(6);
    req.body.classCode = randomCode.trim();
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
            message: 'Class Room not found'
        })
    }
    res.status(200).json({
        success: true,
        classRoom
    })
}

exports.joinClass = async (req, res, next) => {
    const { enteredCode } = req.body;

    try {
        const foundClass = await Class.findOne({ classCode: enteredCode });
        console.log(foundClass)
        if (!foundClass) {
            return res.status(404).json({ message: "Class not found." });
        }

        const isUserJoined = foundClass.joinedUsers.some(user => user.user.toString() === req.user._id);
        if (isUserJoined) {
            return res.status(400).json({ message: "User already joined the class." });
        }

        foundClass.joinedUsers.push({ user: req.user._id });

        await foundClass.save();

        res.status(200).json({ message: "User joined the class successfully." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error." });
    }
}