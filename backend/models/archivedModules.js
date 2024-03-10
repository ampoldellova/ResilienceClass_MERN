const mongoose = require('mongoose')

const archivedModuleSchema = new mongoose.Schema({
    coverImage: {
        public_id: {
            type: String,
            default: 'ResilienceClass/ModuleImages/network-information-security-and-data-protection_phhj3o'
        },
        url: {
            type: String,
            default: 'https://res.cloudinary.com/dwkmutbz3/image/upload/v1709083480/ResilienceClass/ModuleImages/network-information-security-and-data-protection_phhj3o.gif'
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
    category: {
        type: String,
        required: true
    },
    contents: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },
}, { timestamps: true })

module.exports = mongoose.model('ArchivedModules', archivedModuleSchema);