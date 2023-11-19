'use strict'

const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'test',
});

db.connect(function (err) {
    if (err) {
        console.log(error);
    }
    else {
        console.log('Database connected');
    }
});

module.exports = db;