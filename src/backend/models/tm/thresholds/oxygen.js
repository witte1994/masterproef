const mongoose = require('mongoose');

const oxygenThresholdSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    warningLess: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    dangerLess: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    }
});

module.exports = mongoose.model('OxygenThreshold', oxygenThresholdSchema);