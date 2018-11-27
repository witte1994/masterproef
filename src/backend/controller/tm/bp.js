const mongoose = require('mongoose');

const HistoryController = require('../modules/history');

const BP = require('../../models/tm/bp');
const BpThreshold = require('../../models/tm/thresholds/bp');

exports.get_by_date = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];

    var startDate = new Date();
    startDate.setTime(req.params.start);
    var endDate = new Date();
    endDate.setTime(req.params.end);

    BpThreshold.find({ patient: pId, })
        .select("warningLess warningHigher dangerLess dangerHigher")
        .exec()
        .then(doc => {
            var thresholds = doc[0];
            BP.find({ patient: pId, date: { $gte: startDate, $lt: endDate } })
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

exports.add = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];
    const bp = new BP({
        _id: mongoose.Types.ObjectId(),
        patient: pId,
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

function setThreshold(pId) {
    const bpThreshold = new BpThreshold({
        _id: mongoose.Types.ObjectId(),
        patient: pId,
        warningLess: 75,
        warningHigher: 130,
        dangerLess: 65,
        dangerHigher: 140
    });
    bpThreshold
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
        const bp = new BP({
            _id: mongoose.Types.ObjectId(),
            patient: pId,
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

    var info = {
        patient: pId,
        clinician: null,
        srcElement: "tm",
        operation: "import",
        description: values.length + " blood pressure entries"
    };
    HistoryController.add_to_history(info);
}

exports.update_threshold = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];
    BpThreshold.update({ patient: pId }, { $set: { warningLess: req.body.warningLess, warningHigher: req.body.warningHigher, dangerLess: req.body.dangerLess, dangerHigher: req.body.dangerHigher } })
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

    BpThreshold.find({ patient: pId, })
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