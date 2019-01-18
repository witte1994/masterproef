const mongoose = require('mongoose');

const workflowSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        default: null
    },
    clinician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinician',
        default: null
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    steps: [{
        _id: mongoose.Schema.Types.ObjectId,
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        substeps: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'WorkflowSubstep'
        }]
    }]
});

module.exports = mongoose.model('Workflow', workflowSchema);