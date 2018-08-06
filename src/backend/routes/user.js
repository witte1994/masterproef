const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');

const heartRoutes = require('./heart');
const bpRoutes = require('./bp');
const bsRoutes = require('./bs');
const weightRoutes = require('./weight');

router.use('/:userId/heart', heartRoutes);
router.use('/:userId/bp', bpRoutes);
router.use('/:userId/bs', bsRoutes);
router.use('/:userId/weight', weightRoutes);

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'get users'
    });
});

router.post('/', (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birth: req.body.birth,
        gender: req.body.gender,
        bloodType: req.body.bloodType,
        height: req.body.height,
        address: req.body.address,
        phone: req.body.phone
    });
    user.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Added user",
                createdUser: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:userId', (req, res, next) => {
    const id = req.params.userId;

    User.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
    
});

module.exports = router;