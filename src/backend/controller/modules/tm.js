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

    var values = {};

    for (var i = 0; i < params.length; i++) {
        switch (params[i]) {
            case 'bp':
                values.bp = await BPController.getByDate(start, end, pId);
                break;
            case 'bs':
                values.bs = await BSController.getByDate(start, end, pId);
                break;
            case 'hr':
                values.hr = await HeartController.getByDate(start, end, pId);
                break;
            case 'oxygen':
                values.oxygen = await OxygenController.getByDate(start, end, pId);
                break;
            case 'weight':
                values.weight = await WeightController.getByDate(start, end, pId);
                break;
        }
    }

    res.status(201).json({
        values
    });
};