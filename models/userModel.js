'use strict'

// Required libraries & files
const { DataTypes } = require('sequelize');
const db = require('../config/database');

const User = db.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(16),
        allowNull: false,
        unique: 'username',
    },
    password: {
        type: DataTypes.STRING(32),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'email',
    },
    birthday: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('ADMIN', 'USER'),
        allowNull: false,
        defaultValue: 'USER'
    }
}, {
    freezeTableName: true,  // Force table name = model name
    timestamps: true,       // Enable createdAt and updatedAt
    // paranoid: true          // Enable soft delete
});


//Sync table
// User.sync({ alter: true });

module.exports = User;