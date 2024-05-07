'use strict'

// Required libraries & files
const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Data = require('./dataModel');

const Device = db.define('Device', {
    DeviceID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    DeviceName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    DeviceCode: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: 'DeviceCode',
    },
}, {
    // freezeTableName: true,  // Force table name = model name
    timestamps: true,       // Enable createdAt and updatedAt
    // paranoid: true          // Enable soft delete
});

Device.hasMany(Data, {
    foreignKey: {
        name: 'DeviceCode',
    },
});
Data.belongsTo(Device, {
    foreignKey: {
        name: 'DeviceCode',
    },
});

module.exports = Device;