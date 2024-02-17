const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    class: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Class'
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    contents: {
        type: String,
        required: true
    },
    attachments: [
        {
            public_id: {
                type: String
            },
            url: {
                type: String
            }
        }
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            },
            body: {
                type: String,
                required: true
            },
            commentCreated: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model('Post', postSchema);