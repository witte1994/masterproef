const mongoose = require('mongoose');

const HistoryController = require('../modules/history');

const Oxygen = require('../../models/tm/oxygen');
const OxygenThreshold = require('../../models/tm/thresholds/oxygen');

exports.get_by_date = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];

    var startDate = new Date();
    startDate.setTime(req.params.start);
    var endDate = new Date();
    endDate.setTime(req.params.end);

    OxygenThreshold.find({ patient: pId, })
        .select("warningLess dangerLess")
        .exec()
        .then(doc => {
            var thresholds = doc[0];
            Oxygen.find({ patient: pId, date: { $gte: startDate, $lt: endDate } })
                .select("value date")
                .exec()
                .then(doc => {
                    var avg = 0;

                    count = 0;
                    for (i in doc) {
                        avg += doc[i].value;
                        count++;
                    }

                    var avgLine = [];
                    if (count > 0) {
                        avg /= count;

                        var avgBlock = {};
                        avgBlock['value'] = avg;
                        avgBlock['text'] = "Avg. blood oxygen saturation = " + avg.toFixed(1) + " %SpO2";

                        avgLine.push(avgBlock);
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

exports.add = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];
    const oxygen = new Oxygen({
        _id: mongoose.Types.ObjectId(),
        patient: pId,
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
};

function setThreshold(pId) {
    const oxygenThreshold = new OxygenThreshold({
        _id: mongoose.Types.ObjectId(),
        patient: pId,
        warningLess: 94,
        dangerLess: 90
    });
    oxygenThreshold
        .save()
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err);
        });
}

exports.importValues = function (pId, values) {
    setThreshold(pId);

    for (var i = 0; i < values.length; i++) {
        const oxygen = new Oxygen({
            _id: mongoose.Types.ObjectId(),
            patient: pId,
            value: values[i].value,
            date: values[i].date
        });
        oxygen
            .save()
            .then()
            .catch(err => {
                console.log(err);
            });
    }

    var info = {
        patient: pId,
        clinician: null,
        srcElement: "tm",
        operation: "import",
        description: values.length + " blood oxygen level entries"
    };
    HistoryController.add_to_history(info);
}

exports.update_threshold = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];
    OxygenThreshold.update({ patient: pId }, { $set: { warningLess: req.body.warningLess, dangerLess: req.body.dangerLess } })
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
    var pId = req.originalUrl.split('/')[2];

    OxygenThreshold.find({ patient: pId, })
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
};