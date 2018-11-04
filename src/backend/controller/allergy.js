const mongoose = require('mongoose');

const Allergy = require('../models/allergy');

exports.get_all_by_id = (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];

    Allergy.find({ user: userId })
        .lean()
        .exec()
        .then(doc => {
            for (var i = 0; i < doc.length; i++) {
                var dateObj = new Date(doc[i].date);
                Object.assign(doc[i], { dateStr: getDateString(dateObj) });
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
    const allergy = new Allergy({
        _id: mongoose.Types.ObjectId(),
        user: userId,
        name: req.body.name,
        description: req.body.description,
        severity: req.body.severity,
        type: req.body.type,
        date: req.body.date
    });
    allergy
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
    Allergy.findOneAndUpdate({ _id: req.body.id },
            {
                name: req.body.name,
                description: req.body.description,
                severity: req.body.severity,
                type: req.body.type,
                date: req.body.date
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
    Allergy.deleteMany({ _id: req.params.id }, function(err) {
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