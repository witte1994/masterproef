const mongoose = require('mongoose');
const User = require('../models/user');

const BPController = require('../controller/bp');
const BSController = require('../controller/bs');
const HeartController = require('../controller/heart');
const MedicationController = require('../controller/medication');
const OxygenController = require('../controller/oxygen');
const WeightController = require('../controller/weight');

exports.create = (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birth: req.body.birth,
        gender: req.body.gender,
        bloodType: req.body.bloodType,
        height: req.body.height,
        address: req.body.address,
        phone: req.body.phone
    });
    user.save()
        .then(result => {
            setThresholds(user._id);
            console.log(result);
            res.status(201).json({
                message: "Added user",
                createdUser: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

function setThresholds(userId) {
    BPController.setThreshold(userId, null);
    BSController.setThreshold(userId, null);
    HeartController.setThreshold(userId, null);
    MedicationController.setThreshold(userId, null);
    OxygenController.setThreshold(userId, null);
    WeightController.setThreshold(userId, null);
}

exports.get_users = (req, res, next) => {
    User.find()
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

exports.get_user_by_id = (req, res, next) => {
    const id = req.params.userId;

    User.findById(id)
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