const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    console.log(req.originalUrl);
    res.status(200).json({
        message: 'get hearts'
    });
});

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: 'post hearts'
    });
});

module.exports = router;