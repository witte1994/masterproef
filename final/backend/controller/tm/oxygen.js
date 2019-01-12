const mongoose = require('mongoose');

const HistoryController = require('../modules/history');

const Oxygen = require('../../models/tm/oxygen');

exports.getByDate = async function (start, end, pId) {
    const query = Oxygen.find({ patient: pId, date: { $gte: start, $lt: end } }, "value date");

    const result = await query.exec();
    
    return result;
}

exports.getSummary = async function (start, end, pId) {
    const query = Oxygen.find({ patient: pId, date: { $gte: start, $lt: end } }, "value date");

    const result = await query.exec();

    if (result.length == 0) {
        return {
            values: 0,
            avg: "-",
            low: "-",
            high: "-"
        };
    }

    var avg = 0;
    var low = 999999;
    var high = -1;

    for (var i = 0; i < result.length; i++) {
        avg += result[i].value;

        if (result[i].value < low) {
            low = result[i].value;
        }

        if (result[i].value > high) {
            high = result[i].value;
        }
    }

    avg /= result.length;
    avg = Math.round(avg * 100) / 100;

    return {
        values: result.length,
        avg: avg,
        low: low,
        high: high,
    };
}

exports.getAvailability = async function (pId) {
    const query = Oxygen.find({ patient: pId });

    const result = await query.exec();

    if (result.length == 0)
        return false;
    else
        return true;
}

exports.importValues = function (pId, values) {
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