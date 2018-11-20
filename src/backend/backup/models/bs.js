const mongoose = require('mongoose');

const bsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    value: {
        type: Number,
        min: 0,
        max: 50,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('BS', bsSchema);