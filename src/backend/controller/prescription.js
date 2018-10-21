const mongoose = require('mongoose');

const Prescription = require('../models/prescription');

exports.get_all_by_id = (req, res, next) => {
    
};

exports.get_all_by_date = (req, res, next) => {
    
};

exports.create = (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];
    const prescription = new Prescription({
        _id: mongoose.Types.ObjectId(),
        user: userId,
        medication: req.body.medicationId,
        dosage: {
            morning: req.body.dosage.morning,
            noon: req.body.dosage.noon,
            evening: req.body.dosage.evening,
            bed: req.body.dosage.bed
        },
        startDate: req.body.startDate,
        endDate: req.body.endDate
    });
    prescription
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.update = (req, res, next) => {
    
};

exports.delete = (req, res, next) => {
    Prescription.deleteMany({ _id: req.body.id }, function(err) {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        } else {
            console.log(result);
            res.status(201).json(result);
        }
    });
};