    const mongoose = require('mongoose')

    const classSchema = new mongoose.Schema({
        className: {
            type: String,
            required: [true, 'Please enter class name'],
            trim: true,
            maxLength: [100, 'Class name cannot exceed 100 characters']
        },
        section: {
            type: String,
            required: [true, 'Please enter class section'],
        },
        subject: {
            type: String,
            required: [true, 'Please enter class subject'],
        },
        roomNumber: {
            type: String,
            required: [true, 'Please enter class room number'],
        },
        coverPhoto: {
            public_id: {
                type: String,
                default: 'ResilienceClass/classCoverPhotos/user_fr5bdx'
            },
            url: {
                type: String,
                default: 'https://res.cloudinary.com/dwkmutbz3/image/upload/v1707029676/ResilienceClass/classCoverPhotos/360_F_214316329_vX8WM2z1DLYfzcyRxqOenc9SJV7gXOyJ_flnrrp.jpg'
            }
        },
        classCode: {
            type: String,
            required: true

        },
        joinedUsers: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'user'
                },
                role: {
                    type: String
                },
                dateJoined: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        createdAt: {
            type: Date,
            default: Date.now
        }
    })

    module.exports = mongoose.model('Class', classSchema);