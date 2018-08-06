const mongoose = require('mongoose');

const weightThresholdSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    goal: Number,
});

module.exports = mongoose.model('WeightThreshold', weightThresholdSchema);