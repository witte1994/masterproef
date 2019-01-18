const mongoose = require('mongoose');

const clinicianSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    login: { 
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    clearance: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    }
});

module.exports = mongoose.model('Clinician', clinicianSchema);