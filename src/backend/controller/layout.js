const mongoose = require('mongoose');

const Layout = require('../models/layout');

exports.save = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];

    Layout.deleteMany({ patient: pId, clinician: req.body.cId}, function(err) {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        } else {
            const layout = new Layout({
                _id: mongoose.Types.ObjectId(),
                patient: pId,
                clinician: req.body.cId,
                patientElementSize: req.body.layout.patientElementSize,
                small: req.body.layout.small,
                main: req.body.layout.main
            });
            layout
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
        }
    });
};

exports.get = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];
    var cId = req.originalUrl.split('/')[4];

    console.log(cId);

    Layout.find({ patient: pId, clinician: cId})
        .select("patientElementSize small main")
        .exec()
        .then(doc => {
            console.log(doc[0]);
            res.status(200).json(doc[0]);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.default = function (pId) {
    const layout = new Layout({
        _id: mongoose.Types.ObjectId(),
        patient: pId,
        patientElementSize: "large",
        small: [],
        main: []
    });
    layout
        .save()
        .then()
        .catch(err => {
            console.log(err);
        });
}