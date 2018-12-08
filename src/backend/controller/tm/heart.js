const mongoose = require('mongoose');

const HistoryController = require('../modules/history');

const Heart = require('../../models/tm/heart');

exports.getByDate = async function (start, end, pId) {
    const query = Heart.find({ patient: pId, date: { $gte: start, $lt: end } }, "value date");

    const result = await query.exec();
    
    return result;
}

exports.getAvailability = async function (pId) {
    const query = Heart.find({ patient: pId });

    const result = await query.exec();

    if (result.length == 0)
        return false;
    else
        return true;
}

exports.importValues = function (pId, values) {
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