const mongoose = require('mongoose');

const History = require('../../models/modules/history');

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

function getDateString(date) {
    var str = ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
    return str;
}