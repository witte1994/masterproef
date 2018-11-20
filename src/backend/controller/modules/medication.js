const mongoose = require('mongoose');

const HistoryController = require('./history');
const PrescriptionController = require('./prescription');
const Medication = require('../../models/modules/medication');

exports.import = (req, res, next) => {
    for (var i = 0; i < req.body.length; i++) {
        importMedication(req.body[i]);
    }

    var info = {
        patient: null,
        clinician: null,
        srcElement: "medication",
        operation: "import",
        description: req.body.length + " medicine entries"
    };
    HistoryController.add_to_history(info);

    res.status(201).json({
        message: "Medication imported"
    });
};

exports.importPrescriptions = function (pId, values) {
    var medicines = values.medicines;
    var prescriptions = values.prescriptions;

    for (var i = 0; i < medicines.length; i++) {
        medicines[i]._id = mongoose.Types.ObjectId();
    }

    Medication.create(medicines)
        .then(doc => {
            var info = {
                patient: pId,
                clinician: null,
                srcElement: "medication",
                operation: "import",
                description: medicines.length + " medicine entries"
            };
            HistoryController.add_to_history(info);

            PrescriptionController.importValues(pId, prescriptions);
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