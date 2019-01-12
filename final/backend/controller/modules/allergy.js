const mongoose = require('mongoose');

const HistoryController = require('./history');
const Allergy = require('../../models/modules/allergy');

exports.importValues = function (pId, values) {
    for (var i = 0; i < values.length; i++) {
        const allergy = new Allergy({
            _id: mongoose.Types.ObjectId(),
            patient: pId,
            name: values[i].name,
            description: values[i].description,
            severity: values[i].severity,
            type: values[i].type,
            date: values[i].date
        });
        allergy
            .save()
            .then()
            .catch(err => {
                console.log(err);
            });
    }

    var info = {
        patient: pId,
        clinician: null,
        srcElement: "allergy",
        operation: "import",
        description: values.length + " allergy entries"
    };
    HistoryController.add_to_history(info);
}

exports.get_all_by_id = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];

    Allergy.find({ patient: pId })
        .lean()
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

exports.create = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];
    const allergy = new Allergy({
        _id: mongoose.Types.ObjectId(),
        patient: pId,
        name: req.body.name,
        description: req.body.description,
        severity: req.body.severity,
        type: req.body.type,
        date: req.body.date
    });
    allergy
        .save()
        .then(result => {
            var info = {
                patient: pId,
                clinician: null,
                srcElement: "allergy",
                operation: "create",
                description: allergy.type + ": '" + allergy.name + "' with severity of " + allergy.severity
            };
            HistoryController.add_to_history(info);

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

exports.update = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];
    Allergy.findOneAndUpdate({ _id: req.body.id },
            {
                name: req.body.name,
                description: req.body.description,
                severity: req.body.severity,
                type: req.body.type,
                date: req.body.date
            },
            { new: true })
        .exec()
        .then(doc => {
            var info = {
                patient: pId,
                clinician: null,
                srcElement: "allergy",
                operation: "update",
                description: req.body.type + ": '" + req.body.name + "' with severity of " + req.body.severity
            };
            HistoryController.add_to_history(info);

            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.delete = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];
    Allergy.deleteMany({ _id: req.params.id }, function(err) {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        } else {
            var info = {
                patient: pId,
                clinician: null,
                srcElement: "allergy",
                operation: "delete",
                description: "Allergy entry removed"
            };
            HistoryController.add_to_history(info);

            console.log("DELETE ok");
            res.status(200).json({
                message: "DELETE ok"
            });
        }
    });
};