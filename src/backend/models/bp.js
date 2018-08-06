const mongoose = require('mongoose');

const bpSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    systolic: Number,
    diastolic: Number,
    date: Date
});

module.exports = mongoose.model('BP', bpSchema);