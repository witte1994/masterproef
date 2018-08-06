const mongoose = require('mongoose');

const oxygenSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    value: Number,
    date: Date
});

module.exports = mongoose.model('Oxygen', oxygenSchema);