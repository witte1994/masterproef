const mongoose = require('mongoose');

const HistoryController = require('../modules/history');

const Heart = require('../../models/tm/heart');
const HeartThreshold = require('../../models/tm/thresholds/heart');

exports.get_by_date = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];

    var startDate = new Date();
    startDate.setTime(req.params.start);
    var endDate = new Date();
    endDate.setTime(req.params.end);

    HeartThreshold.find({ patient: pId, })
        .select("warningLess warningHigher dangerLess dangerHigher")
        .exec()
        .then(doc => {
            var thresholds = doc[0];
            Heart.find({ patient: pId, date: { $gte: startDate, $lt: endDate } })
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
                        avgBlock['text'] = "Avg. heart rate = " + avg.toFixed(1) + " BPM";

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

exports.getByDate = async function (start, end, pId) {
    const query = Heart.find({ patient: pId, date: { $gte: start, $lt: end } }, "value date");

    const result = await query.exec();
    
    return result;
}

exports.add = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];
    const heart = new Heart({
        _id: mongoose.Types.ObjectId(),
        patient: pId,
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
};

function setThreshold(pId) {
    const heartThreshold = new HeartThreshold({
        _id: mongoose.Types.ObjectId(),
        patient: pId,
        warningLess: 55,
        warningHigher: 75,
        dangerLess: 45,
        dangerHigher: 85
    });
    heartThreshold
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
        const heart = new Heart({
            _id: mongoose.Types.ObjectId(),
            patient: pId,
            value: values[i].value,
            date: values[i].date
        });
        heart
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
        description: values.length + " heart rate entries"
    };
    HistoryController.add_to_history(info);
}

exports.update_threshold = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];
    HeartThreshold.update({ patient: pId }, { $set: { warningLess: req.body.warningLess, warningHigher: req.body.warningHigher, dangerLess: req.body.dangerLess, dangerHigher: req.body.dangerHigher } })
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

    HeartThreshold.find({ patient: pId })
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