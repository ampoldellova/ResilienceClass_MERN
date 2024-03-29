const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const generateCode = require('../utils/codeGenerator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [30, 'Your name cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Your password must be longer than 6 characters'],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            default: 'ResilienceClass/Avatars/user_fr5bdx'
        },
        url: {
            type: String,
            default: 'https://res.cloudinary.com/dwkmutbz3/image/upload/v1706838340/ResilienceClass/Avatars/user_fr5bdx.png'
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    emailCodeVerification: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    emailCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
});

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
    // Hash and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    // Set token expire time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000
    return resetToken
}

userSchema.methods.getEmailCodeVerification = async function () {
    const code = generateCode(6);
    this.emailCodeVerification = code.trim();
    this.emailCodeExpire = Date.now() + 5 * 60 * 1000;
    return code;
}

module.exports = mongoose.model('User', userSchema);