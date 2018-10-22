const mongoose = require('mongoose');

const allergySchema = mongoose.Schema({
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
    severity: {
        type: Number,
        min: 0,
        max: 4,
        required: true
    },
    type: {
        type: String,
        enum: ['Food', 'Skin', 'Respiratory', 'Drug', 'Other'],
        default: 'Other',
        required: true
    },
    date: {
        type: Date,
        required: true
    },

});

module.exports = mongoose.model('Allergy', allergySchema);