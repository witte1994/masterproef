const express = require('express');
const mysql = require('mysql');
var cors = require('cors');

// DB
const db = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    database: 'dashboard'
});

// connect
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected');
});

const app = express();

app.use(cors({credentials: true, origin: true}));

// create db
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE dashboard';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('DB created');
    })
});

app.get('/getusers', (req, res) => {
    let sql = 'SELECT * FROM user';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.send(results);
    })
});

app.get('/getuser/:id', (req, res) => {
    let sql = `SELECT * FROM user WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.send(results);
    })
});

app.get('/gethrsmall/:id', (req, res) => {
    let sql = `SELECT * FROM hr WHERE user_id = ${req.params.id}`;
    let query = db.query(sql, (err, results) => {
        if (err) throw err;

        var today = new Date();
        today.setMilliseconds(0);
        today.setSeconds(0);
        today.setMinutes(0);
        today.setHours(0);
        console.log(today.toString());
        var lastWeek = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
        console.log(lastWeek.toString());
        var avgTotal = 0, avgWeek = 0;
        var lowTotal = 99999, lowWeek = 99999;
        var highTotal = -1, highWeek = -1;
        
        var numWeekValues = 0;
        for (var i = 0; i < results.length; i++) {
            var value = results[i].value
            var date = new Date(results[i].time);
            avgTotal += value;
            if (value < lowTotal)
                lowTotal = value;
            if (value > highTotal)
                highTotal = value;
            
            if (date > lastWeek) {
                numWeekValues++;
                avgWeek += value;
                if (value < lowWeek)
                    lowWeek = value;
                if (value > highWeek)
                    highWeek = value;
            }
        }
        avgTotal = Math.round(avgTotal / results.length);
        avgWeek = Math.round(avgWeek / numWeekValues);

        var stats = {"avg_total": avgTotal, "low_total": lowTotal, "high_total": highTotal, "avg_week": avgWeek, "low_week": lowWeek, "high_week": highWeek};
        res.send(stats);
    })
});

app.get('/gethrlarge/:id', (req, res) => {
    let sql = `SELECT value, time, is_read FROM hr WHERE user_id = ${req.params.id}`;
    let query = db.query(sql, (err, results) => {
        if (err) throw err;

        res.send(results);
    })
});

app.get('/getweightsmall/:id', (req, res) => {
    let sql = `SELECT weight.value, weight.time, user.height FROM weight JOIN user ON weight.user_id = user.id WHERE weight.user_id = ${req.params.id}`;
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        var today = new Date();
        today.setMilliseconds(0);
        today.setSeconds(0);
        today.setMinutes(0);
        today.setHours(0);
        var lastWeek = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
        var lastMonth = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));

        var startWeight = 0, currentWeight = 0;
        var lastWeekWeight = 0, lastMonthWeight = 0;
        var bmiStart = 0; bmiCurrent = 0;
        var height = 0;
        
        for (var i = 0; i < results.length; i++) {
            var value = results[i].value;
            var date = new Date(results[i].time);

            if (i == 0) {
                startWeight = value;
                height = results[i].height;
                bmiStart = value / (height * height);
            }
            if (i == results.length - 1) {
                currentWeight = value;
                bmiCurrent = value / (height * height);
            }
            if (date < lastWeek)
                lastWeekWeight = value;
            if (date < lastMonth)
                lastMonthWeight = value;
        }

        if (lastMonthWeight == 0)
            lastMonthWeight = startWeight;

        var stats = {"start_weight": startWeight, "current_weight": currentWeight, "lost_week": (currentWeight - lastWeekWeight), "lost_month": (currentWeight - lastMonthWeight), "bmi_start": bmiStart.toFixed(2), "bmi_current": bmiCurrent.toFixed(2)};
        res.send(stats);
    })
});

app.get('/getweightlarge/:id', (req, res) => {
    let sql = `SELECT value, time, is_read FROM weight WHERE user_id = ${req.params.id}`;
    let query = db.query(sql, (err, results) => {
        if (err) throw err;

        res.send(results);
    })
});

app.listen('3000', () => {
    console.log('Server started on port 3000');
});