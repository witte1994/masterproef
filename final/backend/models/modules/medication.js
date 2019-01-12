const mongoose = require('mongoose');

const medicationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    description: {
        type: String,
        required: true
    },
    sideEffects: {
        type: String,
        required: true
    },
    interactsWith: [{
        type: String
    }]
});

module.exports = mongoose.model('Medication', medicationSchema);