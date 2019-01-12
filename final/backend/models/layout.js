const mongoose = require('mongoose');

const layoutSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    clinician: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinician'
    },
    patientElementSize: {
        type: String,
        required: true
    },
    small: [{
        elementName: {
            type: String,
            required: true
        },
        height: {
            type: Number,
            min: 0,
            required: true
        },
        y: {
            type: Number,
            min: 0,
            required: true
        },
        settings: {
            type: Object
        }
    }],
    main: [{
        elementName: {
            type: String,
            required: true
        },
        x: {
            type: Number,
            min: 0,
            required: true
        },
        y: {
            type: Number,
            min: 0,
            required: true
        },
        width: {
            type: Number,
            min: 0,
            required: true
        },
        height: {
            type: Number,
            min: 0,
            required: true
        },
        settings: {
            type: Object
        }
    }]
});

module.exports = mongoose.model('Layout', layoutSchema);