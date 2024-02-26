const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    coverImage: {
        public_id: {
            type: String,
            default: 'ResilienceClass/CourseImages/network-information-security-and-data-protection_nceqa6'
        },
        url: {
            type: String,
            default: 'https://res.cloudinary.com/dwkmutbz3/image/upload/v1708962485/ResilienceClass/CourseImages/network-information-security-and-data-protection_nceqa6.gif'
        }
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    language: {
        type: String,
        required: true
    },
    contents: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }]
}, { timestamps: true })

module.exports = mongoose.model('Course', courseSchema);