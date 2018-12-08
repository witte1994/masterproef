const mongoose = require('mongoose');

const HistoryController = require('../modules/history');

const Weight = require('../../models/tm/weight');

exports.getByDate = async function (start, end, pId) {
    const query = Weight.find({ patient: pId, date: { $gte: start, $lt: end } }, "value date");

    const result = await query.exec();
    
    return result;
}

exports.importValues = function (pId, values) {
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