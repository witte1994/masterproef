const mongoose = require('mongoose');

const Weight = require('../models/weight');
const WeightThreshold = require('../models/thresholds/weight');

exports.get_by_date = (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];

    var startDate = new Date();
    startDate.setTime(req.params.start);
    var endDate = new Date();
    endDate.setTime(req.params.end);

    WeightThreshold.find({ user: userId, })
        .select("goal")
        .exec()
        .then(doc => {
            var thresholds = doc[0];
            Weight.find({ user: userId, date: { $gte: startDate, $lt: endDate } })
                .select("value date")
                .exec()
                .then(doc => {
                    res.status(200).json({
                        goal: thresholds.goal,
                        values: doc
                    });
                })
                .catch();
        })
        .catch(err => {
            console.log(err);
        });
};

exports.get_small_by_date = (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];

    var startDate = new Date();
    startDate.setTime(req.params.start);
    var endDate = new Date();
    endDate.setTime(req.params.end);

    console.log(startDate.toString());
    console.log(endDate.toString());

    WeightThreshold.find({ user: userId, })
        .select("goal")
        .exec()
        .then(doc => {
            var thresholds = doc[0];
            Weight.find({ user: userId })
                .select("value date")
                .sort('date')
                .exec()
                .then(doc => {
                    var goal = thresholds.goal;
                    if (doc.length > 0) {
                        var startWeight = doc[0].value;
                        console.log(startWeight);
                        var curWeight = doc[doc.length - 1].value;
                        var difference = curWeight - startWeight;

                        var startPeriod = -1;
                        var endPeriod = -1;
                        for (var i = 0; i < doc.length; i++) {
                            var date = new Date(doc[i].date);

                            if (date.getTime() > startDate.getTime() && date.getTime() < endDate.getTime() && startPeriod == -1) {
                                startPeriod = doc[i].value;
                            }
                            if (date.getTime() < endDate.getTime() && date.getTime() > startDate.getTime()) {
                                endPeriod = doc[i].value;
                            }
                        }

                        var totalCol = "";
                        var periodCol = "";
                        console.log(goal);
                        console.log((goal - curWeight));
                        console.log((goal - startWeight));
                        if (Math.abs((goal - curWeight)) < Math.abs((goal - startWeight)))
                            totalCol = "green";
                        else
                            totalCol = "red";

                        var periodDifference = 0;
                        if (startPeriod != -1 && endPeriod != -1) {
                            periodDifference = endPeriod - startPeriod;
                            if (Math.abs((goal - endPeriod)) < Math.abs((goal - startPeriod)))
                                periodCol = "green";
                            else
                                periodCol = "red";

                            res.status(200).json({
                                startWeight: startWeight,
                                curWeight: curWeight,
                                difference: difference.toFixed(1),
                                startPeriod: startPeriod,
                                endPeriod: endPeriod,
                                periodDifference: periodDifference.toFixed(1),
                                totalCol: totalCol,
                                periodCol: periodCol,
                                goal: thresholds
                            });
                        } else {
                            res.status(200).json({
                                startWeight: startWeight,
                                curWeight: curWeight,
                                difference: difference.toFixed(1),
                                startPeriod: "?",
                                endPeriod: "?",
                                periodDifference: "?",
                                totalCol: totalCol,
                                periodCol: "",
                                goal: thresholds
                            });
                        }
                    } else {
                        res.status(200).json({
                            startWeight: "?",
                            curWeight: "?",
                            difference: "?",
                            startPeriod: "?",
                            endPeriod: "?",
                            periodDifference: "?",
                            totalCol: "",
                            periodCol: "",
                            goal: thresholds.goal
                        });
                    }
                })
                .catch();
        })
        .catch(err => {
            console.log(err);
        });
};

exports.add = (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];
    const weight = new Weight({
        _id: mongoose.Types.ObjectId(),
        user: userId,
        value: req.body.value,
        date: req.body.date
    });
    weight
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

exports.setThreshold = function (userId, res) {
    const weightThreshold = new WeightThreshold({
        _id: mongoose.Types.ObjectId(),
        user: userId,
        goal: 80
    });
    weightThreshold
        .save()
        .then(result => {
            console.log(result);
            if (res != null)
                res.status(201).json(result);
        })
        .catch(err => {
            console.log(err);
            if (res != null)
                res.status(500).json({
                    error: err
                });
        });
}

exports.importValues = function (userId, values) {
    for (var i = 0; i < values.length; i++) {
        const weight = new Weight({
            _id: mongoose.Types.ObjectId(),
            user: userId,
            value: values[i].value,
            date: values[i].date
        });
        weight
            .save()
            .then()
            .catch(err => {
                console.log(err);
            });
    }
}

exports.update_threshold = (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];
    WeightThreshold.update({ user: userId }, { $set: { goal: req.body.goal } })
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
};

exports.get_threshold = (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];

    WeightThreshold.find({ user: userId, })
        .select("goal")
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