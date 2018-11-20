const mongoose = require('mongoose');

const medicationThresholdSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    warningLess: Number,
    dangerLess: Number
});

module.exports = mongoose.model('MedicationThreshold', medicationThresholdSchema);