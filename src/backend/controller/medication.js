const mongoose = require('mongoose');

const PrescriptionController = require('./prescription');
const Medication = require('../models/medication');

exports.import = (req, res, next) => {
    for (var i = 0; i < req.body.length; i++) {
        importMedication(req.body[i]);
    }

    res.status(201).json({
        message: "Medication imported"
    });
};

exports.importPrescriptions = function (userId, values) {
    var medicines = values.medicines;
    var prescriptions = values.prescriptions;

    for (var i = 0; i < medicines.length; i++) {
        medicines[i]._id = mongoose.Types.ObjectId();
    }

    Medication.create(medicines)
        .then(doc => {
            PrescriptionController.importValues(userId, prescriptions);
        })
        .catch(err => {
            console.log(err);
        });
}

function importMedication(info) {
    const medication = new Medication({
        _id: mongoose.Types.ObjectId(),
        name: info.name,
        description: info.description,
        sideEffects: info.sideEffects
    });
    medication
        .save()
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err);
        });
}

exports.get_medication = (req, res, next) => {
    Medication.find()
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};