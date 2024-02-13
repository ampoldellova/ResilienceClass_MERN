const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    class: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Class'
    },
    contents: {
        type: String,
        required: true
    },
    attachments: {
        type: File
    },
    comments: [
        {
            body: {
                type: String,
                required: true
            },
            fileAttachments: {
                type: File
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Class', classSchema);