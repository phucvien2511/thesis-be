'use strict'

// Required libraries & files
const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Device = require('./deviceModel');
const Topic = require('./topicModel');

const Room = db.define('Room', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: 'name',
    },
    status: {
        type: DataTypes.ENUM('AVAILABLE', 'BOOKED', 'UNAVAILABLE'),
        allowNull: false,
        defaultValue: 'AVAILABLE',
    },
    cardId: {
        type: DataTypes.CHAR(8),
        unique: 'cardId',
        allowNull: true,
    }
}, {
    freezeTableName: true,  // Force table name = model name
    timestamps: true,       // Enable createdAt and updatedAt
    // paranoid: true          // Enable soft delete
});

// 1 room has many devices
// Connect id to Device.roomId
Room.hasMany(Device, {
    foreignKey: 'roomId',
    sourceKey: 'id',
});

module.exports = Room;
