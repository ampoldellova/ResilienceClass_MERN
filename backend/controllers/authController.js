const User = require('../models/user');
const sendToken = require('../utils/jwtToken');
const cloudinary = require('cloudinary')
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail')

exports.registerUser = async (req, res, next) => {
    if (req.file) {
        req.body.avatar = req.file.path
    }
    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'ResilienceClass/Avatars',
        width: 150,
        crop: "scale"
    }, (err, res) => {
        console.log(err, res);
    });
    const { name, email, password, role } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        },
    })

    if (!user) {
        return res.status(500).json({
            success: false,
            message: 'user not created'
        })
    }
    sendToken(user, 200, res)

}