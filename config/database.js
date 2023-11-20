'use strict';

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'bksmarthotel',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || 'phuc25112002',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false,
    }
);

// Check the database connection
sequelize
    .authenticate()
    .then(() => {
        console.log('Database connected successfully.');
    })
    .catch((error) => {
        console.error('Error connecting database: ', error);
    });

sequelize.sync({ alter: true });

module.exports = sequelize;