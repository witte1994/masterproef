const mongoose = require('mongoose');

const Layout = require('../models/layout');

exports.save = (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];

    Layout.deleteMany({ user: userId}, function(err) {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        } else {
            const layout = new Layout({
                _id: mongoose.Types.ObjectId(),
                user: userId,
                layout: req.body.layout
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

exports.empty = (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];

    
};