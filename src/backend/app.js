const express = require('express');
const mysql = require('mysql')

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

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

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

app.listen('3000', () => {
    console.log('Server started on port 3000');
});