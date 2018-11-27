const mongoose = require('mongoose');

const weightThresholdSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    goal: {
        type: Number,
        min: 0,
        max: 500,
        required: true
    }
});

module.exports = mongoose.model('WeightThreshold', weightThresholdSchema);