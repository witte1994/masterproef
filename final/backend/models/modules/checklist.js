const mongoose = require('mongoose');

const checklistSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    steps: [{
        _id: mongoose.Schema.Types.ObjectId,
        checked: {
            type: Boolean,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        substeps: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ChecklistSubstep'
        }]
    }]
});

module.exports = mongoose.model('Checklist', checklistSchema);