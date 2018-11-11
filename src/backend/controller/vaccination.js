const mongoose = require('mongoose');

const Vaccination = require('../models/vaccination');

exports.importValues = function (userId, values) {
    for (var i = 0; i < values.length; i++) {
        const vaccination = new Vaccination({
            _id: mongoose.Types.ObjectId(),
            user: userId,
            name: values[i].name,
            description: values[i].description,
            entries: [],
            dateNext: values[i].dateNext
        });
        vaccination
            .save()
            .then(doc => {
                importEntries(doc._id, values[i].entries);
            })
            .catch(err => {
                console.log(err);
            });
    }
}

function importEntries(vaccinationId, entries) {
    for (var i = 0; i < entries.length; i++) {
        var entry = {
            _id: mongoose.Types.ObjectId(),
            description: entries[i].description,
            date: entries[i].date
        };
    
        Vaccination.findOneAndUpdate({ _id: vaccinationId },
            {
                $push: { entries: entry }
            },
            { new: true })
            .exec()
            .then()
            .catch(err => {
                console.log(err);
            });
    }
}

exports.get_all_by_id = (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];

    Vaccination.find({ user: userId })
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
    var userId = req.originalUrl.split('/')[2];
    const vaccination = new Vaccination({
        _id: mongoose.Types.ObjectId(),
        user: userId,
        name: req.body.name,
        description: req.body.description,
        entries: [],
        dateNext: req.body.dateNext
    });
    vaccination
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

exports.update = (req, res, next) => {
    Vaccination.findOneAndUpdate({ _id: req.body.id },
            {
                name: req.body.name,
                description: req.body.description,
                dateNext: req.body.dateNext
            },
            { new: true })
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

exports.delete = (req, res, next) => {
    Vaccination.deleteMany({ _id: req.params.id }, function(err) {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        } else {
            console.log("DELETE ok");
            res.status(200).json({
                message: "DELETE ok"
            });
        }
    });
};

exports.create_entry = (req, res, next) => {
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
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.update_entry = (req, res, next) => {
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
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.delete_entry = (req, res, next) => {
    var vaccinationId = req.params.id;
    var entryId = req.params.entryId;

    Vaccination.findOneAndUpdate({ _id: vaccinationId },
        {
            $pull: { entries: { _id: entryId } }
        },
        { new: true })
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