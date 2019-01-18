const mongoose = require('mongoose');

const oxygenSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    value: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Oxygen', oxygenSchema);