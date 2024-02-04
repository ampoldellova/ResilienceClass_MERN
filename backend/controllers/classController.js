const Class = require('../models/class');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary')

exports.newClass = async (req, res, next) => {
    const classRoom = await Class.create(req.body);
    if (!classRoom)
        return res.status(400).json({
            success: false,
            message: 'Class Room has not been created'
        })

    res.status(201).json({
        success: true,
        classRoom
    })
}