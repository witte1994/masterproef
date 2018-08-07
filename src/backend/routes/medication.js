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
                .sort("name")
                .exec()
                .then(doc => {
                    var dataArrays = [];
                    var dateArrays = [];
                    var colName = "";
                    var curArray = [];
                    var curDateArray = [];
                    var xsDates = {};

                    var indivStrings = {};

                    var totalVals = 0, totalGoal = 0, percentage = 0;
                    for (var i = 0; i < doc.length; i++) {
                        if (colName !== doc[i].name) {
                            if (curArray.length > 0) {
                                dataArrays.push(curArray);
                                dateArrays.push(curDateArray);
                            }

                            colName = doc[i].name;

                            curArray = [];
                            curDateArray = [];
                            curArray.push(colName);
                            curDateArray.push("x"+colName);
                            xsDates[colName.toString()] = "x" + colName;

                            indivStrings[colName] = [];
                        }

                        curArray.push(doc[i].value / doc[i].goal * 100);
                        curDateArray.push(getDateString(new Date(doc[i].date)));

                        indivStrings[colName].push("" + doc[i].value + "/" + doc[i].goal);
                    }
                    if (curArray.length > 0) {
                        dataArrays.push(curArray);
                        dateArrays.push(curDateArray);
                    }

                    res.status(200).json({
                        thresholds: thresholds,
                        values: dataArrays,
                        dates: dateArrays,
                        xsDates: xsDates,
                        indivStrings: indivStrings
                    });
                })
                .catch();
        })
        .catch(err => {
            console.log(err);
        });
});

function getDateString(date) {
    var str = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
    return str;
}

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
                .sort("name")
                .exec()
                .then(doc => {
                    var dataArrays = [];
                    var colName = "";
                    var curItem = {};
                    var totalVals = 0, totalGoal = 0, percentage = 0;
                    for (var i = 0; i < doc.length; i++) {
                        if (colName !== doc[i].name) {
                            if (Object.keys(curItem).length !== 0 && curItem.constructor === Object) {
                                percentage = (totalVals / totalGoal * 100);

                                curItem["values"] = totalVals;
                                curItem["goal"] = totalGoal;
                                curItem["percentage"] = percentage.toFixed(1);

                                if (percentage <= thresholds.dangerLess)
                                    curItem["color"] = "#ff9999";
                                else if (percentage <= thresholds.warningLess)
                                    curItem["color"] = "#ffff80";
                                else 
                                    curItem["color"] = "#4dff88";

                                dataArrays.push(curItem);
                            }
                            
                            colName = doc[i].name;
                            totalVals = 0;
                            totalGoal = 0;
                            curItem = {};
                            curItem["name"] = colName;
                        }
                        totalVals += doc[i].value;
                        totalGoal += doc[i].goal;
                    }
                    if (Object.keys(curItem).length !== 0 && curItem.constructor === Object) {
                        percentage = (totalVals / totalGoal * 100);

                        curItem["values"] = totalVals;
                        curItem["goal"] = totalGoal;
                        curItem["percentage"] = percentage.toFixed(1);

                        if (percentage <= thresholds.dangerLess)
                            curItem["color"] = "#ff9999";
                        else if (percentage <= thresholds.warningLess)
                            curItem["color"] = "#ffff80";
                        else
                            curItem["color"] = "#4dff88";

                        dataArrays.push(curItem);
                    }

                    res.status(200).json({
                        thresholds: thresholds,
                        values: dataArrays
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