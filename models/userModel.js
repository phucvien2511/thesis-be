'use strict'

// Required libraries & files
const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Room = require('./roomModel');

const User = db.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(32),
        allowNull: false,
    },
    contractCode: {
        type: DataTypes.CHAR(6),
        allowNull: false,
    },
    roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    // email: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    //     unique: 'email',
    // },
}, {
    freezeTableName: true,  // Force table name = model name
    timestamps: true,       // Enable createdAt and updatedAt
    // paranoid: true          // Enable soft delete
});

User.hasOne(Room, {
    foreignKey: 'id',
    sourceKey: 'roomId',
});

//Sync table
// User.sync({ alter: true });

module.exports = User;