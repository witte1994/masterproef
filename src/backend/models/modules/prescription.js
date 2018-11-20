const mongoose = require('mongoose');

const prescriptionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    medication: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medication',
        required: true
    },
    dosage: {
        morning: {
            type: Number,
            min: 0,
            max: 20,
            required: true
        },
        noon: {
            type: Number,
            min: 0,
            max: 20,
            required: true
        },
        evening: {
            type: Number,
            min: 0,
            max: 20,
            required: true
        },
        bed: {
            type: Number,
            min: 0,
            max: 20,
            required: true
        }
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);