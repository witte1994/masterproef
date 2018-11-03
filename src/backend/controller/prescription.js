const mongoose = require('mongoose');

const Prescription = require('../models/prescription');

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

    Prescription.find({ 
        $and: 
            [
                { user: { $eq: userId } },
                { $or: 
                    [
                        { $and: [ { startDate: { $lt: end } }, { endDate: { $gte: end } } ] },
                        { $and: [ { startDate: { $lte: start } }, { endDate: { $gt: start } } ] },
                        { $and: [ { startDate: { $gte: start } }, { endDate: { $lt: end } } ] }
                    ]}
            ]
        })
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
    Prescription.findOneAndUpdate({ _id: req.body.id },
            {
                dosage: req.body.dosage,
                startDate: req.body.startDate,
                endDate: req.body.endDate
            },
            { new: true })
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

exports.delete = (req, res, next) => {
    console.log(req.params.id);
    Prescription.deleteMany({ _id: req.params.id }, function(err) {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        } else {
            console.log("DELETE ok");
            res.status(200).json({
                message: "DELETE ok"
            });
        }
    });
};