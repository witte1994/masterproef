const mongoose = require('mongoose');

const checklistSubstepSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    checked: {
        type: Boolean,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('ChecklistSubstep', checklistSubstepSchema);