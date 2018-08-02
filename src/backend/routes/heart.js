const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Heart = require('../models/heart');
const HeartThreshold = require('../models/thresholds/heart');

router.get('/', (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];
    console.log(userId);
    res.status(200).json({
        message: 'get hearts'
    });
});

router.get('/:start&:end', (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];

    var startDate = new Date();
    startDate.setTime(req.params.start);
    var endDate = new Date();
    endDate.setTime(req.params.end);

    HeartThreshold.find({ user: userId, })
        .select("warningLess warningHigher dangerLess dangerHigher")
        .exec()
        .then(doc => {
            var thresholds = doc[0];
            Heart.find({ user: userId, date: { $gte: startDate, $lt: endDate } })
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


    HeartThreshold.find({ user: userId, })
        .select("warningLess warningHigher dangerLess dangerHigher")
        .exec()
        .then(doc => {
            var thresholds = doc[0];
            Heart.find({ user: userId, date: { $gte: startDate, $lt: endDate } })
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

                        if (doc[i].value <= thresholds.dangerLess || doc[i].value >= thresholds.dangerHigher) dangerVals++;
                        else if (doc[i].value <= thresholds.warningLess || doc[i].value >= thresholds.warningHigher) warningVals++;
                        else okVals++;
                    }

                    var lowCol = "";
                    var avgCol = "";
                    var highCol = "";
                    if (count > 0) {
                        avg /= count;

                        if (low <= thresholds.dangerLess || low >= thresholds.dangerHigher) lowCol = "red";
                        else if (low <= thresholds.warningLess || low >= thresholds.warningHigher) lowCol = "yellow";
                        else lowCol = "green";

                        if (avg <= thresholds.dangerLess || avg >= thresholds.dangerHigher) avgCol = "red";
                        else if (avg <= thresholds.warningLess || avg >= thresholds.warningHigher) avgCol = "yellow";
                        else avgCol = "green";

                        if (high <= thresholds.dangerLess || high >= thresholds.dangerHigher) highCol = "red";
                        else if (high <= thresholds.warningLess || high >= thresholds.warningHigher) highCol = "yellow";
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
    const heart = new Heart({
        _id: mongoose.Types.ObjectId(),
        user: userId,
        value: req.body.value,
        date: req.body.date
    });
    heart
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
    const heartThreshold = new HeartThreshold({
        _id: mongoose.Types.ObjectId(),
        user: userId,
        warningLess: 55,
        warningHigher: 75,
        dangerLess: 45,
        dangerHigher: 85
    });
    heartThreshold
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
    HeartThreshold.update({ user: userId }, { $set: { warningLess: req.body.warningLess, warningHigher: req.body.warningHigher, dangerLess: req.body.dangerLess, dangerHigher: req.body.dangerHigher }})
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

    HeartThreshold.find({ user: userId, })
        .select("warningLess warningHigher dangerLess dangerHigher")
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