const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Oxygen = require('../models/oxygen');
const OxygenThreshold = require('../models/thresholds/oxygen');

router.get('/:start&:end', (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];

    var startDate = new Date();
    startDate.setTime(req.params.start);
    var endDate = new Date();
    endDate.setTime(req.params.end);

    OxygenThreshold.find({ user: userId, })
        .select("warningLess dangerLess")
        .exec()
        .then(doc => {
            var thresholds = doc[0];
            Oxygen.find({ user: userId, date: { $gte: startDate, $lt: endDate } })
                .select("value date")
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

    OxygenThreshold.find({ user: userId, })
        .select("warningLess dangerLess")
        .exec()
        .then(doc => {
            var thresholds = doc[0];
            Oxygen.find({ user: userId, date: { $gte: startDate, $lt: endDate } })
                .select("value date")
                .exec()
                .then(doc => {
                    var low = 99999, avg = 0, high = -1;
                    var dangerVals = 0;
                    var warningVals = 0;
                    var okVals = 0;
                    count = 0;
                    for (i in doc) {
                        if (doc[i].value < low) low = doc[i].value;
                        if (doc[i].value > high) high = doc[i].value;
                        avg += doc[i].value;
                        count++;

                        if (doc[i].value <= thresholds.dangerLess) dangerVals++;
                        else if (doc[i].value <= thresholds.warningLess) warningVals++;
                        else okVals++;
                    }

                    var lowCol = "";
                    var avgCol = "";
                    var highCol = "";
                    if (count > 0) {
                        avg /= count;

                        if (low <= thresholds.dangerLess) lowCol = "red";
                        else if (low <= thresholds.warningLess) lowCol = "yellow";
                        else lowCol = "green";

                        if (avg <= thresholds.dangerLess) avgCol = "red";
                        else if (avg <= thresholds.warningLess) avgCol = "yellow";
                        else avgCol = "green";

                        if (high <= thresholds.dangerLess) highCol = "red";
                        else if (high <= thresholds.warningLess) highCol = "yellow";
                        else highCol = "green";

                        avg = avg.toFixed(1);
                    } else {
                        low = "?";
                        high = "?";
                        avg = "?";
                        dangerVals = "?";
                        warningVals = "?";
                        okVals = "?";
                    }

                    res.status(200).json({
                        low: low.toString(),
                        high: high.toString(),
                        avg: avg,
                        dangerVals: dangerVals,
                        warningVals: warningVals,
                        okVals: okVals,
                        lowCol: lowCol,
                        avgCol: avgCol,
                        highCol: highCol
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
    const oxygen = new Oxygen({
        _id: mongoose.Types.ObjectId(),
        user: userId,
        value: req.body.value,
        date: req.body.date
    });
    oxygen
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
    const oxygenThreshold = new OxygenThreshold({
        _id: mongoose.Types.ObjectId(),
        user: userId,
        warningLess: 94,
        dangerLess: 90
    });
    oxygenThreshold
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
    OxygenThreshold.update({ user: userId }, { $set: { warningLess: req.body.warningLess, dangerLess: req.body.dangerLess } })
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

    OxygenThreshold.find({ user: userId, })
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