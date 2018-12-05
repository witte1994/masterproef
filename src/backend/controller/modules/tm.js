const mongoose = require('mongoose');

const HistoryController = require('./history');

const BPController = require('../tm/bp');
const BSController = require('../tm/bs');
const HeartController = require('../tm/heart');
const OxygenController = require('../tm/oxygen');
const WeightController = require('../tm/weight');

exports.get_data = async (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];

    var start = req.body.time.start;
    var end = req.body.time.end;
    var params = req.body.values;

    var values = [];

    for (var i = 0; i < params.length; i++) {
        var paramData = {
            enum: params[i]
        };
        switch (params[i]) {
            case 'bp':
                paramData.param = "Blood pressure";
                paramData.values = await BPController.getByDate(start, end, pId);
                break;
            case 'bs':
                paramData.param = "Blood sugar";
                paramData.values = await BSController.getByDate(start, end, pId);
                break;
            case 'hr':
                paramData.param = "Heart rate";
                paramData.values = await HeartController.getByDate(start, end, pId);
                break;
            case 'oxygen':
                paramData.param = "Oxygen";
                paramData.values = await OxygenController.getByDate(start, end, pId);
                break;
            case 'weight':
                paramData.param = "Weight";
                paramData.values = await WeightController.getByDate(start, end, pId);
                break;
        }
        values.push(paramData);
    }

    res.status(201).json({
        values
    });
};