const mongoose = require('mongoose');

const History = require('../../models/modules/history');
const modulesController = require('../modules');

exports.add_to_history = function (info) {
    const history = new History({
        _id: new mongoose.Types.ObjectId(),
        patient: info.patient,
        clinician: info.clinician,
        srcElement: info.srcElement,
        operation: info.operation,
        description: info.description,
        date: new Date()
    });
    history.save()
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err);
            return -1;
        });
}

exports.get_by_id = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];

    History.find({ patient: pId })
        .sort({ date: 1 })
        .lean()
        .exec()
        .then(doc => {
            addTimeFields(doc);
            
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch();
};

exports.get_by_filter = (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];

    var start = new Date(0);
    if (req.body.startDate != null)
        start = new Date(req.body.startDate);
    
    var end = new Date("2200-01-01T00:00:00");
    if (req.body.endDate != null)
        end = new Date(req.body.endDate);

    var enums = modulesController.getEnums();
    if (req.body.modules.length > 0)
        enums = req.body.modules;

    console.log(enums);

    History.find({
            patient: pId,
            date: { 
                $gte: start, $lt: end
            },
            srcElement: {
                $in: enums
            },
            operation: {
                $in: req.body.operations
            }
        })
        .sort({ date: 1 })
        .lean()
        .exec()
        .then(doc => {
            addTimeFields(doc);

            console.log(doc);
            res.status(200).json(doc);
        })
        .catch();
};

function addTimeFields(doc) {
    for (var i = 0; i < doc.length; i++) {
        var dateObj = new Date(doc[i].date);
        Object.assign(doc[i], { dateStr: getDateString(dateObj) });
        Object.assign(doc[i], { timeStr: getTimeString(dateObj) });
    }
}

function getDateString(date) {
    var str = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
    return str;
}

function getTimeString(date) {
    var str = ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
    return str;
}