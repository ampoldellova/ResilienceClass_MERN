const Module = require('../models/module');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary');
const User = require('../models/user');

exports.newModule = async (req, res, next) => {
    req.body.creator = req.user._id

    try {
        if (req.files.coverImage) {
            const result = await cloudinary.v2.uploader.upload(req.files.coverImage[0].path, {
                folder: 'ResilienceClass/ModuleImages',
                crop: "scale"
            })

            req.body.coverImage = {
                public_id: result.public_id,
                url: result.secure_url
            }
        }

        if (req.files.contents) {
            const result = await cloudinary.v2.uploader.upload(req.files.contents[0].path, {
                folder: 'ResilienceClass/Modules',
                crop: "scale"
            })

            req.body.contents = {
                public_id: result.public_id,
                url: result.secure_url
            }
        }

        const modules = await Module.create(req.body);

        res.status(200).json({
            success: true,
            modules: modules,
            message: 'Learning module added'
        })
    } catch (error) {
        console.log(error)
    }

}

exports.getAllModules = async (req, res, next) => {
    const modules = await Module.find().populate({
        path: 'creator',
        model: User
    });

    res.status(200).json({
        success: true,
        modules
    })
}

exports.getSingleModule = async (req, res, next) => {
    const module = await Module.findById(req.params.id).populate({
        path: 'creator',
        model: User
    })

    if (!module) {
        return res.status(404).json({
            success: false,
            message: 'Module not found'
        })
    }
    res.status(200).json({
        success: true,
        module: module
    })
}

exports.deleteModule = async (req, res, next) => {
    const module = await Module.findByIdAndDelete(req.params.id);
    if (!module) {
        return res.status(404).json({
            success: false,
            message: 'Learning Module not found'
        })
    }

    res.status(200).json({
        success: true,
        message: 'Learning Module deleted'
    })
}