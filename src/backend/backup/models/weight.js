const mongoose = require('mongoose');

const weightSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    value: {
        type: Number,
        min: 0,
        max: 500,
        required: true
    },
    date: {
        type: Number,
        min: 0,
        max: 300,
        required: true
    }
});

module.exports = mongoose.model('Weight', weightSchema);