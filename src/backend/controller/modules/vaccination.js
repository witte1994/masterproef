const mongoose = require('mongoose');

const HistoryController = require('./history');
const Vaccination = require('../../models/modules/vaccination');

exports.importValues = function (pId, values) {
    for (var i = 0; i < values.length; i++) {
        var curVac = values[i];
        
        if (!("entries" in curVac))
            curVac.entries = [];

        for (var j = 0; j < curVac.entries.length; j++) {
            curVac.entries[j]._id = mongoose.Types.ObjectId();
        }
        
        const vaccination = new Vaccination({
            _id: mongoose.Types.ObjectId(),
            patient: pId,
            name: curVac.name,
            description: curVac.description,
            entries: curVac.entries,
            dateNext: curVac.dateNext
        });
        vaccination
            .save()
            .then(doc => {
                console.log(doc);
            })
            .catch(err => {
                console.log(err);
            });
    }

    var info = {
        patient: null,
        clinician: null,
        srcElement: "vaccination",
        operation: "import",
        description: values.length + " vaccination entries"
    };
    HistoryController.add_to_history(info);
}

exports.get_all_by_id = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];

    Vaccination.find({ patient: pId })
        .lean()
        .exec()
        .then(doc => {
            for (var i = 0; i < doc.length; i++) {
                var dateObj = new Date(doc[i].dateNext);
                Object.assign(doc[i], { dateNextStr: getDateString(dateObj) });
                for (var j = 0; j < doc[i].entries.length; j++) {
                    Object.assign(doc[i].entries[j], { dateStr: getDateString(doc[i].entries[j].date) });
                }
            }
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

function getDateString(date) {
    var str = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
    return str;
}


exports.create = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];
    const vaccination = new Vaccination({
        _id: mongoose.Types.ObjectId(),
        patient: pId,
        name: req.body.name,
        description: req.body.description,
        entries: [],
        dateNext: req.body.dateNext
    });
    vaccination
        .save()
        .then(result => {
            var info = {
                patient: pId,
                clinician: null,
                srcElement: "vaccination",
                operation: "create",
                description: vaccination.name + ": " + vaccination.description
            }
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
    Vaccination.findOneAndUpdate({ _id: req.body.id },
            {
                name: req.body.name,
                description: req.body.description,
                dateNext: req.body.dateNext
            },
            { new: true })
        .exec()
        .then(doc => {
            var info = {
                patient: pId,
                clinician: null,
                srcElement: "vaccination",
                operation: "update",
                description: req.body.name + ": " + req.body.description
            }
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
    Vaccination.deleteMany({ _id: req.params.id }, function(err) {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        } else {
            var info = {
                patient: pId,
                clinician: null,
                srcElement: "vaccination",
                operation: "delete",
                description: "Vaccination entry removed"
            }
            HistoryController.add_to_history(info);

            res.status(200).json({
                message: "DELETE ok"
            });
        }
    });
};

exports.create_entry = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];
    var vaccinationId = req.params.id;

    var entry = {
        _id: mongoose.Types.ObjectId(),
        description: req.body.description,
        date: req.body.date
    };

    Vaccination.findOneAndUpdate({ _id: vaccinationId },
        {
            $push: { entries: entry }
        },
        { new: true })
        .exec()
        .then(doc => {
            var info = {
                patient: pId,
                clinician: null,
                srcElement: "vaccination",
                operation: "create",
                description: entry.description + " (" + getDateString(new Date(entry.date)) + ")"
            }
            HistoryController.add_to_history(info);

            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.update_entry = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];
    var vaccinationId = req.params.id;

    var entry = {
        _id: req.body.id,
        description: req.body.description,
        date: req.body.date
    };

    Vaccination.findOneAndUpdate({ "_id": vaccinationId, "entries._id": entry._id  },
        {
            $set: { "entries.$.description": entry.description,
                    "entries.$.date": entry.date }
        },
        { new: true })
        .exec()
        .then(doc => {
            var info = {
                patient: pId,
                clinician: null,
                srcElement: "vaccination",
                operation: "update",
                description: entry.description + " (" + getDateString(new Date(entry.date)) + ")"
            }
            HistoryController.add_to_history(info);

            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.delete_entry = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];
    var vaccinationId = req.params.id;
    var entryId = req.params.entryId;

    Vaccination.findOneAndUpdate({ _id: vaccinationId },
        {
            $pull: { entries: { _id: entryId } }
        },
        { new: true })
        .exec()
        .then(doc => {
            var info = {
                patient: pId,
                clinician: null,
                srcElement: "vaccination",
                operation: "delete",
                description: "Vaccination sub entry removed"
            }
            HistoryController.add_to_history(info);

            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};