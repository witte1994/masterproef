const mongoose = require('mongoose');

const weightSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    value: Number,
    date: Date
});

module.exports = mongoose.model('Weight', weightSchema);