'use strict'

// Required libraries & files
const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Data = db.define('Data', {
    DataID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Value: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    // freezeTableName: true,  // Force table name = model name
    timestamps: true,       // Enable createdAt and updatedAt
    // paranoid: true          // Enable soft delete
});

module.exports = Data;