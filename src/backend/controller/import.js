const mongoose = require('mongoose');

const PatientController = require('./patient');

exports.import = (req, res, next) => {
    for (var i = 0; i < req.body.length; i++) {
        PatientController.importPatient(req.body[i]);
    }
    
    res.status(201).json({
        message: "OK",
    });
};