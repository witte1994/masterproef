const mongoose = require('mongoose');

const vaccinationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Vaccination', vaccinationSchema);