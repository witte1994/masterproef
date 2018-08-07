const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Medication = require('../models/medication');
const MedicationThreshold = require('../models/thresholds/medication');

router.get('/:start&:end', (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];

    var startDate = new Date();
    startDate.setTime(req.params.start);
    var endDate = new Date();
    endDate.setTime(req.params.end);

    MedicationThreshold.find({ user: userId })
        .select("warningLess dangerLess")
        .exec()
        .then(doc => {
            var thresholds = doc[0];
            Medication.find({ user: userId, date: { $gte: startDate, $lt: endDate } })
                .select("name value goal date")
                .exec()
                .then(doc => {
                    res.status(200).json({
                        thresholds: thresholds,
                        values: doc
                    });
                })
                .catch();
        })
        .catch(err => {
            console.log(err);
        });
});

router.get('/small/:start&:end', (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];

    var startDate = new Date();
    startDate.setTime(req.params.start);
    var endDate = new Date();
    endDate.setTime(req.params.end);

    MedicationThreshold.find({ user: userId, })
        .select("warningLess dangerLess")
        .exec()
        .then(doc => {
            var thresholds = doc[0];
            Medication.find({ user: userId, date: { $gte: startDate, $lt: endDate } })
                .select("name value goal date")
                .exec()
                .then(doc => {
                    res.status(200).json({
                        
                    });
                })
                .catch();
        })
        .catch(err => {
            console.log(err);
        });
});

router.post('/', (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];
    const medication = new Medication({
        _id: mongoose.Types.ObjectId(),
        user: userId,
        name: req.body.name,
        value: req.body.value,
        goal: req.body.goal,
        date: req.body.date
    });
    medication
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
});

router.post('/threshold', (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];
    const medicationThreshold = new MedicationThreshold({
        _id: mongoose.Types.ObjectId(),
        user: userId,
        warningLess: 90,
        dangerLess: 60
    });
    medicationThreshold
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
});

router.patch('/threshold', (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];
    MedicationThreshold.update({ user: userId }, { $set: { warningLess: req.body.warningLess, dangerLess: req.body.dangerLess } })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/threshold', (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];

    MedicationThreshold.find({ user: userId, })
        .select("warningLess dangerLess")
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

module.exports = router;