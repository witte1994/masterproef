const mongoose = require('mongoose');

const bpThresholdSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    warningLess: {
        type: Number,
        min: 0,
        max: 300,
        required: true
    },
    warningHigher: {
        type: Number,
        min: 0,
        max: 300,
        required: true
    },
    dangerLess: {
        type: Number,
        min: 0,
        max: 300,
        required: true
    },
    dangerHigher: {
        type: Number,
        min: 0,
        max: 300,
        required: true
    }
});

module.exports = mongoose.model('BpThreshold', bpThresholdSchema);