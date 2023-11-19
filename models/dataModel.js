'use strict'

// Required libraries & files
const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Device = require('./deviceModel');

const Data = db.define('Data', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    topic: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    deviceId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    freezeTableName: true,  // Force table name = model name
    timestamps: true,       // Enable createdAt and updatedAt
    paranoid: true          // Enable soft delete
});

// 1 data point belongs to 1 device
Data.belongsTo(Device, {
    foreignKey: 'deviceId'
});

//Sync table
Data.sync({ alter: true });

module.exports = Data;