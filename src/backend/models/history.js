const mongoose = require('mongoose');

const historySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    clinician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinician'
    },
    srcElement: {
        type: String,
        enum: ['user', 'allergy', 'medication', 'prescription', 'vaccination', 'other'],
        default: 'other',
        required: true
    },
    operation: {
        type: String,
        enum: ['create', 'update', 'delete', 'import', 'other'],
        default: 'other',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('History', historySchema);