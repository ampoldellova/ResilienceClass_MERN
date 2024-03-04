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

exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please enter email & password' })
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return res.status(401).json({ message: 'Invalid Email or Password' })
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return res.status(401).json({ message: 'Invalid Email or Password' })
    }

    sendToken(user, 200, res)
}

exports.getUserProfile = async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
}

exports.updateProfile = async (req, res, next) => {
    console.log(req.body)
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    };

    if (req.body.avatar !== '') {
        const user = await User.findById(req.body.id);

        // const image_id = user.avatar.public_id;
        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'ResilienceClass/Avatars',
            width: 150,
            crop: "scale"
        });

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        return res.status(401).json({ message: 'User Not Updated' });
    }

    res.status(200).json({
        success: true
    });
};

exports.logout = async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
}

exports.forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({ error: 'User not found with this email' })
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    // Create reset password url
    const resetUrl = `${req.protocol}://localhost:3000/password/reset/${resetToken}`;
    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`
    try {
        await sendEmail({
            email: user.email,
            subject: 'Kickz Password Recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({ error: error.message })
    }
}

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

exports.deleteUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(401).json({ message: `User does not found with id: ${req.params.id}` })
    }

    const image_id = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(image_id);
    await User.findByIdAndRemove(req.params.id);
    return res.status(200).json({
        success: true,
    })
}

exports.updateUser = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    if (req.body.avatar !== '') {
        const user = await User.findById(req.body.id);

        // const image_id = user.avatar.public_id;
        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'ResilienceClass/Avatars',
            width: 150,
            crop: "scale"
        });

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        };
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
    })

    return res.status(200).json({
        success: true,
        user: user
    })
}

exports.getUserDetails = async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(400).json({ message: `User does not found with id: ${req.params.id}` })
    }

    res.status(200).json({
        success: true,
        user
    })
}

