'use strict'

// Required libraries & files
const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Device = require('./deviceModel');

const Topic = db.define('Topic', {
    TopicID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    TopicName: {
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: 'topicName',
    },
    TopicDescription: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    // roomId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: true,
    // },
}, {
    // freezeTableName: true,  // Force table name = model name
    timestamps: true,       // Enable createdAt and updatedAt
    // paranoid: true          // Enable soft delete
});

Topic.hasMany(Device, {
    foreignKey: {
        name: 'TopicID',
    },

});
Device.belongsTo(Topic, {
    foreignKey: {
        name: 'TopicID',
    },
});

module.exports = Topic;
