const mongoose = require('mongoose');

const HistoryController = require('./history');
const Medication = require('../models/medication');
const Prescription = require('../models/prescription');

exports.importValues = function (userId, values) {
    for (var i = 0; i < values.length; i++) {
        importPrescription(userId, values[i]);
    }

    var info = {
        user: null,
        clinician: null,
        srcElement: "prescription",
        operation: "import",
        description: values.length + " prescription entries"
    };
    HistoryController.add_to_history(info);
}

function importPrescription(userId, info) {
    Medication.findOne({ name: info.medName })
        .exec()
        .then(doc => {
            const prescription = new Prescription({
                _id: mongoose.Types.ObjectId(),
                user: userId,
                medication: doc._id,
                dosage: {
                    morning: info.dosage.morning,
                    noon: info.dosage.noon,
                    evening: info.dosage.evening,
                    bed: info.dosage.bed
                },
                startDate: info.startDate,
                endDate: info.endDate
            });
            prescription
                .save()
                .then(result => {
                    console.log(result);
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.get_all_by_id = (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];

    Prescription.aggregate([
        { $match: { user: mongoose.Types.ObjectId(userId) } },
        {
          $lookup:{
            from: "medications",
            localField: "medication",
            foreignField: "_id",
            as: "medication"
          }
        },
        { $unwind:"$medication"}
        ])
        .exec()
        .then(doc => {
            for (var i = 0; i < doc.length; i++) {
                var startDateObj = new Date(doc[i].startDate);
                Object.assign(doc[i], { startStr: getDateString(startDateObj) });
                var endDateObj = new Date(doc[i].endDate);
                Object.assign(doc[i], { endStr: getDateString(endDateObj) });
            }
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};


exports.get_all_by_date = (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];

    var start = new Date();
    start.setTime(req.params.start);
    var end = new Date();
    end.setTime(req.params.end);

    Prescription.aggregate([
        { $match: { 
            $and: 
            [
                { user: mongoose.Types.ObjectId(userId) },
                { $or: 
                    [
                        { $and: [ { startDate: { $lte: end } }, { endDate: { $gt: end } } ] },
                        { $and: [ { startDate: { $lt: start } }, { endDate: { $gte: start } } ] },
                        { $and: [ { startDate: { $gte: start } }, { endDate: { $lte: end } } ] }
                    ]}
            ]
         } },
        {
          $lookup:{
            from: "medications",
            localField: "medication",
            foreignField: "_id",
            as: "medication"
          }
        },
        { $unwind:"$medication"}
        ])
        .exec()
        .then(doc => {
            for (var i = 0; i < doc.length; i++) {
                var startDateObj = new Date(doc[i].startDate);
                Object.assign(doc[i], { startStr: getDateString(startDateObj) });
                var endDateObj = new Date(doc[i].endDate);
                Object.assign(doc[i], { endStr: getDateString(endDateObj) });
            }
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

function getDateString(date) {
    var str = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
    return str;
}

exports.create = (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];
    const prescription = new Prescription({
        _id: mongoose.Types.ObjectId(),
        user: userId,
        medication: req.body.medication,
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
            var info = {
                user: userId,
                clinician: null,
                srcElement: "prescription",
                operation: "create",
                description: "Dosage: " + prescription.dosage.morning + "/" + prescription.dosage.noon + "/" + prescription.dosage.evening + "/" + prescription.dosage.bed + " (" + getDateString(prescription.startDate) + " - " + getDateString(prescription.endDate) + ")"
            }
            HistoryController.add_to_history(info);

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
    var userId = req.originalUrl.split('/')[2];
    Prescription.findOneAndUpdate({ _id: req.body.id },
            {
                dosage: req.body.dosage,
                startDate: req.body.startDate,
                endDate: req.body.endDate
            },
            { new: true })
        .exec()
        .then(doc => {
            console.log(doc.startDate);
            var info = {
                user: userId,
                clinician: null,
                srcElement: "prescription",
                operation: "update",
                description: "Dosage: " + doc.dosage.morning + "/" + doc.dosage.noon + "/" + doc.dosage.evening + "/" + doc.dosage.bed + " (" + getDateString(doc.startDate) + " - " + getDateString(doc.endDate) + ")"
            }
            HistoryController.add_to_history(info);

            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.delete = (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];
    Prescription.deleteMany({ _id: req.params.id }, function(err) {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        } else {
            var info = {
                user: userId,
                clinician: null,
                srcElement: "prescription",
                operation: "delete",
                description: "Prescription entry removed"
            }
            HistoryController.add_to_history(info);
            res.status(200).json({
                message: "DELETE ok"
            });
        }
    });
};