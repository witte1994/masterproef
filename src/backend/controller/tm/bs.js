const mongoose = require('mongoose');

const HistoryController = require('../modules/history');

const BS = require('../../models/tm/bs');

exports.getByDate = async function (start, end, pId) {
    const query = BS.find({ patient: pId, date: { $gte: start, $lt: end } }, "value date");

    const result = await query.exec();
    
    return result;
}

exports.getAvailability = async function (pId) {
    const query = BS.find({ patient: pId });

    const result = await query.exec();

    if (result.length == 0)
        return false;
    else
        return true;
}

exports.importValues = function (pId, values) {
    for (var i = 0; i < values.length; i++) {
        const bs = new BS({
            _id: mongoose.Types.ObjectId(),
            patient: pId,
            value: values[i].value,
            date: values[i].date
        });
        bs
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
        description: values.length + " blood sugar entries"
    };
    HistoryController.add_to_history(info);
}