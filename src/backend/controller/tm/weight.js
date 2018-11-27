const mongoose = require('mongoose');

const HistoryController = require('../modules/history');

const Weight = require('../../models/tm/weight');
const WeightThreshold = require('../../models/tm/thresholds/weight');

exports.get_by_date = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];

    var startDate = new Date();
    startDate.setTime(req.params.start);
    var endDate = new Date();
    endDate.setTime(req.params.end);

    WeightThreshold.find({ patient: pId, })
        .select("goal")
        .exec()
        .then(doc => {
            var thresholds = doc[0];
            Weight.find({ patient: pId, date: { $gte: startDate, $lt: endDate } })
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

exports.add = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];
    const weight = new Weight({
        _id: mongoose.Types.ObjectId(),
        patient: pId,
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

function setThreshold(pId) {
    const weightThreshold = new WeightThreshold({
        _id: mongoose.Types.ObjectId(),
        patient: pId,
        goal: 80
    });
    weightThreshold
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
        const weight = new Weight({
            _id: mongoose.Types.ObjectId(),
            patient: pId,
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

    var info = {
        patient: pId,
        clinician: null,
        srcElement: "tm",
        operation: "import",
        description: values.length + " weight entries"
    };
    HistoryController.add_to_history(info);
}

exports.update_threshold = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];
    WeightThreshold.update({ patient: pId }, { $set: { goal: req.body.goal } })
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

    WeightThreshold.find({ patient: pId, })
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