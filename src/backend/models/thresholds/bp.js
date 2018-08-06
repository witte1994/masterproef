const mongoose = require('mongoose');

const bpThresholdSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    warningLess: Number,
    warningHigher: Number,
    dangerLess: Number,
    dangerHigher: Number
});

module.exports = mongoose.model('BpThreshold', bpThresholdSchema);