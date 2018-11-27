const mongoose = require('mongoose');
const Patient = require('../models/patient');

const HistoryController = require('./modules/history');
const LayoutController = require('./layout');

const AllergyController = require('./modules/allergy');
const MedicationController = require('./modules/medication');
const VaccinationController = require('./modules/vaccination');

const BPController = require('./tm/bp');
const BSController = require('./tm/bs');
const HeartController = require('./tm/heart');
const OxygenController = require('./tm/oxygen');
const WeightController = require('./tm/weight');

exports.create = (req, res, next) => {
    const patient = new Patient({
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
    patient.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Added patient",
                createdPatient: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.importPatient = function (patientInfo) {
    var info = patientInfo.info;

    const patient = new Patient({
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
    patient.save()
        .then(result => {
            var info = {
                patient: patient._id,
                clinician: null,
                srcElement: "patient",
                operation: "import",
                description: "new patient: " + patient.firstName + " " + patient.lastName + " (" + getDateString(patient.birth) + ")"
            }
            HistoryController.add_to_history(info);

            importRest(patient._id, patientInfo);
            console.log(result);
            return patient._id;
        })
        .catch(err => {
            console.log(err);
            return -1;
        });
}

function importRest(pId, info) {
    LayoutController.default(pId);

    var keys = Object.keys(info);

    for (var i = 0; i < keys.length; i++) {
        switch (keys[i]) {
            case 'allergies':
                AllergyController.importValues(pId, info.allergies);
                break;
            case 'prescriptions':
                MedicationController.importPrescriptions(pId, info.prescriptions);
                break;
            case 'vaccinations':
                VaccinationController.importValues(pId, info.vaccinations);
                break;
            case 'bp':
                BPController.importValues(pId, info.bp);
                break;
            case 'bs':
                BSController.importValues(pId, info.bs);
                break;
            case 'heart':
                HeartController.importValues(pId, info.heart);
                break;
            case 'oxygen':
                OxygenController.importValues(pId, info.oxygen);
                break;
            case 'weight':
                WeightController.importValues(pId, info.weight);
                break;
            default:
                console.log("unknown tag: " + keys[i]);
                break;
        }
    }
}

exports.get_patients = (req, res, next) => {
    Patient.find()
        .lean()
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

exports.get_patient_by_id = (req, res, next) => {
    const id = req.params.pId;

    Patient.findById(id)
        .lean()
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