const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const importRoutes = require('./routes/import');
const userRoutes = require('./routes/user');
const clinicianRoutes = require('./routes/clinician');
const medicationRoutes = require('./routes/medication');

mongoose.connect('mongodb://localhost:27017/dashboard', {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.use('/import', importRoutes);
app.use('/user', userRoutes);
app.use('/clinician', clinicianRoutes);
app.use('/medication', medicationRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;