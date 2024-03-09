'use strict';

const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config();

const createDatabase = async () => {
    await mysql.createConnection({
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
    }).then((connection) => {
        connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`);
        console.log('Database created successfully.')
    })
};

const sequelize = new Sequelize(
    process.env.DB_NAME || 'bksmarthotelv2',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '25112002',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false,
    }
);

// Check the database connection
createDatabase().then(() => {
    sequelize
        .authenticate()
        .then(() => {
            console.log('Database connected successfully.');
        })
        .catch((error) => {
            console.error('Error connecting database: ', error);
        });
    sequelize.sync();
});


module.exports = sequelize;