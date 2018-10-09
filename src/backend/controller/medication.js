const mongoose = require('mongoose');

const Medication = require('../models/medication');

exports.import = (req, res, next) => {
    for (var i = 0; i < req.body.length; i++) {
        importMedication(req.body[i]);
    }

    res.status(201).json({
        message: "Medication imported"
    });
};

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