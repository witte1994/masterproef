const mongoose = require('mongoose');

const medicationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    value: Number,
    goal: Number,
    date: Date
});

module.exports = mongoose.model('Medication', medicationSchema);