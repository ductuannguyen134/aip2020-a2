const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favorModel = {
    ownerID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    debtorID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    items: [{
        name: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
    }],
    isComplete: {
        type: Boolean,
        default: false,
    },
    createdImage: {
        type: String,
    },
    completedImage: {
        type: String,
    },
    completedTime: {
        type: Schema.Types.Date,
    },
//      photo: {
//     data: Buffer,
//     contentType: String
//   }
}

const FavorSchema = new mongoose.Schema(favorModel, {timestamps: true});

module.exports = mongoose.model('Favor', FavorSchema, "favors");