const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Heart = require('../models/heart')

router.get('/', (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];
    console.log(userId);
    res.status(200).json({
        message: 'get hearts'
    });
});

router.get('/small/:start&:end', (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];

    var startDate = new Date();
    startDate.setTime(req.params.start);
    var endDate = new Date();
    endDate.setTime(req.params.end);

    Heart.find({ user: userId, date: { $gte: startDate, $lt: endDate}})
        .select("value date")
        .exec()
        .then(doc => {
            console.log(doc);
            var low = 99999, avg = 0, high = -1;
            count = 0;
            for (i in doc) {
                if (doc[i].value < low) low = doc[i].value;
                if (doc[i].value > high) high = doc[i].value;
                avg += doc[i].value;
                count++
            }
            if (count > 0) {
                avg /= count;
                avg = avg.toFixed(1);
            } else {
                low = "?";
                high = "?";
                avg = "?";
            }

            res.status(200).json({
                low: low.toString(),
                high: high.toString(),
                avg: avg
            });
        })
        .catch();


    
});

router.post('/', (req, res, next) => {
    var userId = req.originalUrl.split('/')[2];
    const heart = new Heart({
        _id: mongoose.Types.ObjectId(),
        user: userId,
        value: req.body.value,
        date: req.body.date
    });
    heart
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;