const mongoose = require('mongoose');

const HistoryController = require('../modules/history');

const BS = require('../../models/tm/bs');
const BsThreshold = require('../../models/tm/thresholds/bs');

exports.get_by_date = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];

    var startDate = new Date();
    startDate.setTime(req.params.start);
    var endDate = new Date();
    endDate.setTime(req.params.end);

    BsThreshold.find({ patient: pId, })
        .select("warningLess warningHigher dangerLess dangerHigher")
        .exec()
        .then(doc => {
            var thresholds = doc[0];
            BS.find({ patient: pId, date: { $gte: startDate, $lt: endDate } })
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
                        avgBlock['text'] = "Avg. blood sugar = " + avg.toFixed(1) + " mmol/L";

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
    const bs = new BS({
        _id: mongoose.Types.ObjectId(),
        patient: pId,
        value: req.body.value,
        date: req.body.date
    });
    bs
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
    const bsThreshold = new BsThreshold({
        _id: mongoose.Types.ObjectId(),
        patient: pId,
        warningLess: 3.9,
        warningHigher: 6.9,
        dangerLess: 3.0,
        dangerHigher: 7.5
    });
    bsThreshold
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
        const bs = new BS({
            _id: mongoose.Types.ObjectId(),
            patient: pId,
            value: values[i].value,
            date: values[i].date
        });
        bs
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
        description: values.length + " blood sugar entries"
    };
    HistoryController.add_to_history(info);
}

exports.update_threshold = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];
    BsThreshold.update({ patient: pId }, { $set: { warningLess: req.body.warningLess, warningHigher: req.body.warningHigher, dangerLess: req.body.dangerLess, dangerHigher: req.body.dangerHigher } })
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

    BsThreshold.find({ patient: pId, })
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