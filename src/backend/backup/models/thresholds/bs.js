const mongoose = require('mongoose');

const bsThresholdSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    warningLess: {
        type: Number,
        min: 0,
        max: 50,
        required: true
    },
    warningHigher: {
        type: Number,
        min: 0,
        max: 50,
        required: true
    },
    dangerLess: {
        type: Number,
        min: 0,
        max: 50,
        required: true
    },
    dangerHigher: {
        type: Number,
        min: 0,
        max: 50,
        required: true
    }
});

module.exports = mongoose.model('BsThreshold', bsThresholdSchema);