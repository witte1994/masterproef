const mongoose = require('mongoose');

const vaccinationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    entries: [{
        _id: mongoose.Schema.Types.ObjectId,
        description: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        }
    }],
    dateNext: {
        type: Date
    }
});

module.exports = mongoose.model('Vaccination', vaccinationSchema);