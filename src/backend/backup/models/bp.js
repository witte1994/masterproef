const mongoose = require('mongoose');

const bpSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    systolic: {
        type: Number,
        min: 0,
        max: 300,
        required: true
    },
    diastolic: {
        type: Number,
        min: 0,
        max: 300,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('BP', bpSchema);