const mongoose = require('mongoose');

const modulesController = require('../../controller/modules');
const enums = modulesController.getEnums();

const historySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },
    clinician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinician'
    },
    srcElement: {
        type: String,
        enum: enums,
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