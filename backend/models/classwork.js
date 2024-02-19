const mongoose = require('mongoose')

const classworkSchema = new mongoose.Schema({
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
    title: {
        type: String,
        required: true
    },
    instructions: {
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
    points: {
        type: Number
    },
    deadline: {
        type: Date,
        default: null
    },
    submissions: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User'
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
            grades: {
                type: Number
            },
            submittedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model('Classwork', classworkSchema);