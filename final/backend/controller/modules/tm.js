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

exports.get_data_small = async (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];

    var start = req.body.time.start;
    var end = req.body.time.end;
    var params = req.body.params;

    var summaries = {
        "bp": {
            values: 0,
            avg: "-",
            low: "-",
            high: "-"
        },
        "bs": {
            values: 0,
            avg: "-",
            low: "-",
            high: "-"
        },
        "hr": {
            values: 0,
            avg: "-",
            low: "-",
            high: "-"
        },
        "oxygen": {
            values: 0,
            avg: "-",
            low: "-",
            high: "-"
        },
        "weight": {
            values: 0,
            start: "-",
            current: "-",
            diff: "-"
        }
    };

    for (var i = 0; i < params.length; i++) {
        switch (params[i]) {
            case 'bp':
                var summary = await BPController.getSummary(start, end, pId);
                summaries.bp.values = summary.values;
                summaries.bp.avg = summary.avg;
                summaries.bp.low = summary.low;
                summaries.bp.high = summary.high;
                break;
            case 'bs':
                var summary = await BSController.getSummary(start, end, pId);
                summaries.bs.values = summary.values;
                summaries.bs.avg = summary.avg;
                summaries.bs.low = summary.low;
                summaries.bs.high = summary.high;
                break;
            case 'hr':
                var summary = await HeartController.getSummary(start, end, pId);
                summaries.hr.values = summary.values;
                summaries.hr.avg = summary.avg;
                summaries.hr.low = summary.low;
                summaries.hr.high = summary.high;
                break;
            case 'oxygen':
                var summary = await OxygenController.getSummary(start, end, pId);
                summaries.oxygen.values = summary.values;
                summaries.oxygen.avg = summary.avg;
                summaries.oxygen.low = summary.low;
                summaries.oxygen.high = summary.high;
                break;
            case 'weight':
                var summary = await WeightController.getSummary(start, end, pId);
                summaries.weight.values = summary.values;
                summaries.weight.start = summary.start;
                summaries.weight.current = summary.current;
                summaries.weight.diff = summary.diff;
                break;
        }
    }

    res.status(201).json(summaries);
};

exports.get_available_params = async (req, res, next) => {
    var pId = req.originalUrl.split('/')[2];

    var availability = {
        'bp': false,
        'bs': false,
        'hr': false,
        'oxygen': false,
        'weight': false
    };

    availability.bp = await BPController.getAvailability(pId);
    availability.bs = await BSController.getAvailability(pId);
    availability.hr = await HeartController.getAvailability(pId);
    availability.oxygen = await OxygenController.getAvailability(pId);
    availability.weight = await WeightController.getAvailability(pId);

    res.status(201).json(availability);
};