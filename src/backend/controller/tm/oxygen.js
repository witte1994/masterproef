const mongoose = require('mongoose');

const HistoryController = require('../modules/history');

const Oxygen = require('../../models/tm/oxygen');

exports.getByDate = async function (start, end, pId) {
    const query = Oxygen.find({ patient: pId, date: { $gte: start, $lt: end } }, "value date");

    const result = await query.exec();
    
    return result;
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