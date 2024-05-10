'use strict'

// Required libraries & files
const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Topic = require('./topicModel');

const Room = db.define('Room', {
    RoomID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    RoomName: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: 'roomName',
    },
    RoomStatus: {
        type: DataTypes.ENUM('AVAILABLE', 'BOOKED', 'UNAVAILABLE'),
        allowNull: false,
        defaultValue: 'AVAILABLE',
    },
    AccessKey: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: 'accessKey',
    },
    RoomDescription: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
}, {
    freezeTableName: true,  // Force table name = model name
    timestamps: true,       // Enable createdAt and updatedAt
    // paranoid: true          // Enable soft delete
});

Room.hasMany(Topic, {
    foreignKey: {
        name: 'RoomID',
    }
});
Topic.belongsTo(Room, {
    foreignKey: {
        name: 'RoomID',
    }
});

module.exports = Room;
