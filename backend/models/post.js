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
        ref: 'user'
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
                ref: 'user'
            },
            body: {
                type: String,
                required: true
            },
            fileAttachments: [
                {
                    public_id: {
                        type: String
                    },
                    url: {
                        type: String
                    }
                }
            ]
        }
    ],
    deadline: {
        type: Date,
        default: null
    },
}, { timestamps: true })

module.exports = mongoose.model('Post', postSchema);