const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Clinician = require('../models/clinician');

router.options('/', (req, res, next) => {
    return res.status(200).json({
        message: "ok"
    });
});

router.post('/signup', (req, res, next) => {
    Clinician.find({login: req.body.login})
        .exec()
        .then(clinician => {
            if (clinician.length >= 1) {
                return res.status(409).json({
                    message: 'clinician exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const clinician = new Clinician({
                            _id: new mongoose.Types.ObjectId(),
                            login: req.body.login,
                            password: hash,
                            clearance: req.body.clearance
                        });
                        clinician
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'clinician created'
                                })
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        })
    
});

router.post('/login', (req, res, next) => {
    Clinician.find({ login: req.body.login })
        .exec()
        .then(clinician => {
            if (clinician.length < 1) {
                return res.status(401).json({
                    message: 'Authorization failed'
                });
            }
            bcrypt.compare(req.body.password, clinician[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Authorization failed'
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            login: clinician[0].login,
                            clinicianId: clinician[0]._id,
                            clearance: clinician[0].clearance
                        }, 
                        "dashboard_secret", 
                        {
                            expiresIn: '1h'
                        }
                    );

                    return res.status(200).json({
                        message: 'Authorization successful',
                        token: token
                    });
                } 
                res.status(401).json({
                    message: 'Authorization failed'
                });

            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;