const mongoose = require('mongoose');

const UserController = require('../controller/user');

exports.import = (req, res, next) => {
    for (var i = 0; i < req.body.length; i++) {
        UserController.importUser(req.body[i]);
    }
    
    res.status(201).json({
        message: "OK",
    });
};