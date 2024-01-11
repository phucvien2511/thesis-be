'use strict'

// Required libraries & files
const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Device = db.define('Device', {
    id: {
        type: DataTypes.STRING(8),
        primaryKey: true,
        allowNull: false,
        unique: 'id',
    },
    name: {
        type: DataTypes.STRING(32),
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('SENSOR', 'ACTUATOR'),
        allowNull: false,
        defaultValue: 'SENSOR',
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    description: {
        type: DataTypes.STRING(128),
        allowNull: true
    },
    productionDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // deviceSize: {
    //     type: DataTypes.STRING(16),
    //     allowNull: true
    // },
    // deviceWeight: {
    //     type: DataTypes.FLOAT,
    //     allowNull: true
    // },
    // deviceVoltage: {
    //     type: DataTypes.FLOAT,
    //     allowNull: true
    // },
    // deviceCurrent: {
    //     type: DataTypes.FLOAT,
    //     allowNull: true
    // },

}, {
    freezeTableName: true,  // Force table name = model name
    timestamps: true,       // Enable createdAt and updatedAt
    // paranoid: true          // Enable soft delete
});

//Sync table
// Device.sync({ alter: true });
module.exports = Device;