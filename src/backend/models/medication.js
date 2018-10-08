const mongoose = require('mongoose');

const medicationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    sideEffects: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Medication', medicationSchema);