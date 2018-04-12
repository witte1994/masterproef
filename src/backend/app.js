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

app.listen('3000', () => {
    console.log('Server started on port 3000');
});