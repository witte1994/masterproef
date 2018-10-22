const mongoose = require('mongoose');

const Vaccination = require('../models/vaccination');

exports.get_all_by_id = (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];

    Vaccination.find({ user: userId })
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

exports.create = (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];
    const vaccination = new Vaccination({
        _id: mongoose.Types.ObjectId(),
        user: userId,
        name: req.body.name,
        description: req.body.description,
        entries: [],
        dateNext: req.body.dateNext
    });
    vaccination
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
    Vaccination.findOneAndUpdate({ _id: req.body.id },
            {
                name: req.body.name,
                description: req.body.description,
                dateNext: req.body.dateNext
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
    Vaccination.deleteMany({ _id: req.params.id }, function(err) {
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

exports.create_entry = (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];

    var entry = {
        _id: mongoose.Types.ObjectId(),
        description: req.body.description,
        date: req.body.date
    };

    // todo
};

exports.update_entry = (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];

    // todo
};

exports.delete_entry = (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];

    // todo
};