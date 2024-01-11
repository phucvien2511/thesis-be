'use strict'

// Required libraries & files
const { DataTypes, Model } = require('sequelize');
const db = require('../config/database');
const Room = require('./roomModel');

const Topic = db.define('Topic', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: 'name',

    },
    description: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    roomId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    freezeTableName: true,  // Force table name = model name
    timestamps: true,       // Enable createdAt and updatedAt
    // paranoid: true          // Enable soft delete
});

// 1 topic belong to 1 room
Topic.belongsTo(Room, {
    foreignKey: 'roomId',
});

// Sync table
//Topic.sync({ alter: true });

module.exports = Topic;
