'use strict'

// Required libraries & files
const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Topic = require('./topicModel');

const Data = db.define('Data', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    value: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    topicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    freezeTableName: true,  // Force table name = model name
    timestamps: true,       // Enable createdAt and updatedAt
    // paranoid: true          // Enable soft delete
});

// 1 data point belongs to 1 topic
// Connect topicId to Topic.id
Data.belongsTo(Topic, {
    foreignKey: 'topicId',
    targetKey: 'id',
});


//Sync table
// Data.sync({ alter: true });

module.exports = Data;