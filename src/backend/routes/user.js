const express = require('express');
const router = express.Router();

const User = require('../models/user');

const heartRoutes = require('./heart')

router.use('/:userId/heart', heartRoutes);

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'get users'
    });
});

router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;

    if (id === 'test') {
        res.status(200).json({
            message: 'OK'
        });
    } else {
        res.status(200).json({
            message: 'false'
        });
    }
});

module.exports = router;