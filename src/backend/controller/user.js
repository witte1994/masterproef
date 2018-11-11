const mongoose = require('mongoose');
const User = require('../models/user');

const LayoutController = require('../controller/layout');

const AllergyController = require('../controller/allergy');
const MedicationController = require('../controller/medication');
const PrescriptionController = require('../controller/prescription');
const VaccinationController = require('../controller/vaccination');

const BPController = require('../controller/bp');
const BSController = require('../controller/bs');
const HeartController = require('../controller/heart');
const OxygenController = require('../controller/oxygen');
const WeightController = require('../controller/weight');

exports.create = (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birth: req.body.birth,
        nid: req.body.nid,
        gender: req.body.gender,
        bloodType: req.body.bloodType,
        height: req.body.height,
        address: req.body.address,
        phone: req.body.phone,
        smoker: req.body.smoker
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

exports.importUser = function (userInfo) {
    var info = userInfo.info;

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        firstName: info.firstName,
        lastName: info.lastName,
        nid: info.nid,
        birth: info.birth,
        gender: info.gender,
        bloodType: info.bloodType,
        height: info.height,
        address: info.address,
        phone: info.phone,
        smoker: info.smoker
    });
    user.save()
        .then(result => {
            //setThresholds(user._id);
            importRest(user._id, userInfo);
            console.log(result);
            return user._id;
        })
        .catch(err => {
            console.log(err);
            return -1;
        });
}

function importRest(userId, info) {
    LayoutController.default(userId);

    var keys = Object.keys(info);

    for (var i = 0; i < keys.length; i++) {
        switch (keys[i]) {
            case 'allergies':
                AllergyController.importValues(userId, info.allergies);
                break;
            case 'prescriptions':
                MedicationController.importValues(info.prescriptions.medicines);
                PrescriptionController.importValues(userId, info.prescriptions.prescriptions);
                break;
            case 'vaccinations':
                VaccinationController.importValues(userId, info.vaccinations);
                break;
            /*
            case 'bpVals':
                BPController.importValues(userId, info.bpVals);
                break;
            case 'bsVals':
                BSController.importValues(userId, info.bsVals);
                break;
            case 'heartVals':
                HeartController.importValues(userId, info.heartVals);
                break;
            case 'oxygenVals':
                OxygenController.importValues(userId, info.oxygenVals);
                break;
            case 'weightVals':
                WeightController.importValues(userId, info.weightVals);
                break;*/
            case 'info':
                console.log("info");
                break;
            default:
                console.log("unknown");
                break;
        }
    }
}

function setThresholds(userId) {
    BPController.setThreshold(userId, null);
    BSController.setThreshold(userId, null);
    HeartController.setThreshold(userId, null);
    OxygenController.setThreshold(userId, null);
    WeightController.setThreshold(userId, null);
}

exports.get_users = (req, res, next) => {
    User.find()
        .lean()
        .exec()
        .then(doc => {
            for (var i = 0; i < doc.length; i++) {
                var dateObj = new Date(doc[i].birth);
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