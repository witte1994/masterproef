const mongoose = require('mongoose');

const clinicianSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    login: { type: String, unique: true },
    password: String,
    clearance: Number
});

module.exports = mongoose.model('Clinician', clinicianSchema);