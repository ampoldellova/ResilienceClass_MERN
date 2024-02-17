const mongoose = require('mongoose')

const classworkSchema = new mongoose.Schema({
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
    }
}, { timestamps: true })

module.exports = mongoose.model('Classwork', classworkSchema);