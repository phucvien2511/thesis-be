'use strict'

// Required libraries & files
const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Device = require('./deviceModel');
// const User = require('./userModel');

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
        type: DataTypes.STRING(8),
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



// 1 room can only have 1 owner 
// Room.belongsTo(User, {
//     foreignKey: 'ownerId',
//     targetKey: 'id',
// });


module.exports = Room;
