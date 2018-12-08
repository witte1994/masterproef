const mongoose = require('mongoose');

const HistoryController = require('../modules/history');

const BP = require('../../models/tm/bp');

exports.getByDate = async function (start, end, pId) {
    const query = BP.find({ patient: pId, date: { $gte: start, $lt: end } }, "systolic diastolic date");

    const result = await query.exec();

    return result;
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