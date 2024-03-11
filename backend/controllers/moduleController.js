const Module = require('../models/module');
const ArchivedModules = require('../models/archivedModules')
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

exports.getAllArchivedModules = async (req, res, next) => {
    const archivedModules = await ArchivedModules.find().populate({
        path: 'creator',
        model: User
    });

    res.status(200).json({
        success: true,
        archivedModules
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
    const archiveModule = await ArchivedModules.findByIdAndDelete(req.params.id);
    if (!archiveModule) {
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

exports.softDeleteModule = async (req, res, next) => {
    try {
        const module = await Module.findById(req.params.id);
        if (!module) {
            return res.status(404).json({
                success: false,
                message: 'Module not found'
            });
        }

        const archivedModule = await ArchivedModules.create(module.toObject());

        await Module.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Module soft deleted and moved to ArchivedModules',
            archivedModule
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.restoreModule = async (req, res, next) => {
    try {
        const archivedModule = await ArchivedModules.findById(req.params.id);
        if (!archivedModule) {
            return res.status(404).json({
                success: false,
                message: 'Archived Module not found'
            });
        }

        const module = await Module.create(archivedModule.toObject());

        await ArchivedModules.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Module restored from ArchivedModules',
            module
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};