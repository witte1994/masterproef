const mongoose = require('mongoose');

const HistoryController = require('../modules/history');

const BP = require('../../models/tm/bp');

exports.getByDate = async function (start, end, pId) {
    const query = BP.find({ patient: pId, date: { $gte: start, $lt: end } }, "systolic diastolic date");

    const result = await query.exec();

    return result;
}

exports.getSummary = async function (start, end, pId) {
    const query = BP.find({ patient: pId, date: { $gte: start, $lt: end } }, "systolic diastolic date");

    const result = await query.exec();

    if (result.length == 0) {
        return {
            values: 0,
            avg: "-",
            low: "-",
            high: "-"
        };
    }

    var avgSys = 0, avgDia = 0;
    var lowSys = 0, lowDia = 0;
    var highSys = 0, highDia = 0;

    var lowSum = 999999, highSum = -1;

    for (var i = 0; i < result.length; i++) {
        avgSys += result[i].systolic;
        avgDia += result[i].diastolic;

        var sum = result[i].systolic + result[i].diastolic;

        if (sum < lowSum) {
            lowSum = sum;
            lowSys = result[i].systolic;
            lowDia = result[i].diastolic;
        }

        if (sum > highSum) {
            highSum = sum;
            highSys = result[i].systolic;
            highDia = result[i].diastolic;
        }
    }

    avgSys /= result.length;
    avgSys = Math.round(avgSys);

    avgDia /= result.length;
    avgDia = Math.round(avgDia);

    return {
        values: result.length,
        avg: "" + avgSys + "/" + avgDia,
        low: "" + lowSys + "/" + lowDia,
        high: "" + highSys + "/" + highDia,
    };
}

exports.getAvailability = async function (pId) {
    const query = BP.find({ patient: pId });

    const result = await query.exec();

    if (result.length == 0)
        return false;
    else
        return true;
}

exports.importValues = function (pId, values) {
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