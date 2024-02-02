const mongoose = require('mongoose')

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter class name'],
        trim: true,
        maxLength: [100, 'Class name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please enter product description'],
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],
    size: {
        type: Number,
        required: [true, 'Please enter shoe size'],
        maxLength: [2, 'Shoe size cannot exceed 2 characters'],
        default: 0.0
    },
    colorway: {
        type: String,
        required: [true, 'Please enter product colorway'],
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please select a brand for this product'],
    },
    type: {
        type: String,
        required: [true, 'Please select type of shoe for this product'],
        enum: {
            values: [
                'High-tops',
                'Mid-cut',
                'Low-tops',
                'Slip-ons'
            ],
            message: 'Please select correct type of shoe for the product'
        }
    },
    stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
        maxLength: [5, 'Product stock cannot exceed 5 characters'],
        default: 0
    },
    reviews: [
        {
            // user: {
            //     type: mongoose.Schema.ObjectId,
            //     ref: 'User',
            //     required: true
            // },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Class', classSchema);