const mongoose = require('mongoose');

const BP = require('../models/bp');
const BpThreshold = require('../models/thresholds/bp');

exports.get_by_date = (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];

    var startDate = new Date();
    startDate.setTime(req.params.start);
    var endDate = new Date();
    endDate.setTime(req.params.end);

    BpThreshold.find({ user: userId, })
        .select("warningLess warningHigher dangerLess dangerHigher")
        .exec()
        .then(doc => {
            var thresholds = doc[0];
            BP.find({ user: userId, date: { $gte: startDate, $lt: endDate } })
                .select("systolic diastolic date")
                .exec()
                .then(doc => {
                    var avgSys = 0;
                    var avgDia = 0;

                    count = 0;
                    for (i in doc) {
                        avgSys += doc[i].systolic;
                        avgDia += doc[i].diastolic;
                        count++;
                    }

                    var avgLine = [];
                    if (count > 0) {
                        avgSys /= count;
                        avgDia /= count;

                        var sysBlock = {};
                        var diaBlock = {};

                        sysBlock['value'] = avgSys;
                        sysBlock['text'] = "Avg. systolic BP = " + avgSys.toFixed(1) + " mmHg";
                        diaBlock['value'] = avgDia;
                        diaBlock['text'] = "Avg. diastolic BP = " + avgDia.toFixed(1) + " mmHg";
                        avgLine.push(sysBlock);
                        avgLine.push(diaBlock);
                    }

                    res.status(200).json({
                        thresholds: thresholds,
                        values: doc,
                        avgLine: avgLine
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

    BpThreshold.find({ user: userId, })
        .select("warningLess warningHigher dangerLess dangerHigher")
        .exec()
        .then(doc => {
            var thresholds = doc[0];
            BP.find({ user: userId, date: { $gte: startDate, $lt: endDate } })
                .select("systolic diastolic date")
                .exec()
                .then(doc => {
                    var lowSys = 99999, avgSys = 0, highSys = -1;
                    var lowDia = 99999, avgDia = 0, highDia = -1;
                    var dangerVals = 0;
                    var warningVals = 0;
                    var okVals = 0;
                    count = 0;
                    for (i in doc) {
                        if (doc[i].diastolic < lowDia) {
                            lowDia = doc[i].diastolic;
                            lowSys = doc[i].systolic;
                        }
                        if (doc[i].systolic > highSys) {
                            highSys = doc[i].systolic;
                            highDia = doc[i].diastolic;
                        }
                        avgSys += doc[i].systolic;
                        avgDia += doc[i].diastolic;
                        count++;

                        if (doc[i].diastolic <= thresholds.dangerLess || doc[i].systolic >= thresholds.dangerHigher) dangerVals++;
                        else if (doc[i].diastolic <= thresholds.warningLess || doc[i].systolic >= thresholds.warningHigher) warningVals++;
                        else okVals++;
                    }

                    var lowCol = "";
                    var avgCol = "";
                    var highCol = "";
                    if (count > 0) {
                        avgSys /= count;
                        avgDia /= count;

                        if (lowDia <= thresholds.dangerLess || lowSys >= thresholds.dangerHigher) lowCol = "red";
                        else if (lowDia <= thresholds.warningLess || lowSys >= thresholds.warningHigher) lowCol = "yellow";
                        else lowCol = "green";

                        if (avgSys <= thresholds.dangerLess || avgDia <= thresholds.dangerLess || avgSys >= thresholds.dangerHigher || avgDia >= thresholds.dangerHigher) avgCol = "red";
                        else if (avgSys <= thresholds.warningLess || avgDia <= thresholds.warningLess || avgSys >= thresholds.warningHigher || avgDia >= thresholds.warningHigher) avgCol = "yellow";
                        else avgCol = "green";

                        if (highDia <= thresholds.dangerLess || highSys >= thresholds.dangerHigher) highCol = "red";
                        else if (highDia <= thresholds.warningLess || highSys >= thresholds.warningHigher) highCol = "yellow";
                        else highCol = "green";

                        avgSys = avgSys.toFixed(1);
                        avgDia = avgDia.toFixed(1);

                        res.status(200).json({
                            low: lowSys.toString() + "/" + lowDia.toString(),
                            high: highSys.toString() + "/" + highDia.toString(),
                            avg: avgSys.toString() + "/" + avgDia.toString(),
                            dangerVals: dangerVals,
                            warningVals: warningVals,
                            okVals: okVals,
                            lowCol: lowCol,
                            avgCol: avgCol,
                            highCol: highCol,
                            thresholds: thresholds
                        });
                    } else {
                        low = "?";
                        high = "?";
                        avg = "?";
                        dangerVals = "?";
                        warningVals = "?";
                        okVals = "?";

                        res.status(200).json({
                            low: low,
                            high: high,
                            avg: avg,
                            dangerVals: dangerVals,
                            warningVals: warningVals,
                            okVals: okVals,
                            lowCol: lowCol,
                            avgCol: avgCol,
                            highCol: highCol,
                            thresholds: thresholds
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
    const bp = new BP({
        _id: mongoose.Types.ObjectId(),
        user: userId,
        systolic: req.body.systolic,
        diastolic: req.body.diastolic,
        date: req.body.date
    });
    bp
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
    const bpThreshold = new BpThreshold({
        _id: mongoose.Types.ObjectId(),
        user: userId,
        warningLess: 75,
        warningHigher: 130,
        dangerLess: 65,
        dangerHigher: 140
    });
    bpThreshold
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
        const bp = new BP({
            _id: mongoose.Types.ObjectId(),
            user: userId,
            systolic: values[i].systolic,
            diastolic: values[i].diastolic,
            date: values[i].date
        });
        bp
            .save()
            .then()
            .catch(err => {
                console.log(err);
            });
    }
}

exports.update_threshold = (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];
    BpThreshold.update({ user: userId }, { $set: { warningLess: req.body.warningLess, warningHigher: req.body.warningHigher, dangerLess: req.body.dangerLess, dangerHigher: req.body.dangerHigher } })
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

    BpThreshold.find({ user: userId, })
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
};