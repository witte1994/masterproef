const mongoose = require('mongoose');

const workflowSubstepSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('WorkflowSubstep', workflowSubstepSchema);