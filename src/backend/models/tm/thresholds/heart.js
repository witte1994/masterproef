const mongoose = require('mongoose');

const heartThresholdSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
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

module.exports = mongoose.model('HeartThreshold', heartThresholdSchema);