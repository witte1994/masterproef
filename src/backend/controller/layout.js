const mongoose = require('mongoose');

const Layout = require('../models/layout');

exports.save = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];

    console.log(req.body.layout.small);
    console.log(req.body.layout.main);

    Layout.deleteMany({ patient: pId}, function(err) {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        } else {
            const layout = new Layout({
                _id: mongoose.Types.ObjectId(),
                patient: pId,
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

    Layout.find({ patient: pId, })
        .select("small main")
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