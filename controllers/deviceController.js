const Device = require('../models/deviceModel');
const { Op } = require("sequelize");
const Topic = require('../models/topicModel');
const { id } = require('ethers/lib/utils');

// Get all devices
const getDevices = async (req, res) => {
    const { name, type, status } = req.query;
    try {
        const whereQuery = {};
        if (name) {
            whereQuery.name = { [Op.like]: `%${name}%` };
        }
        if (type) {
            whereQuery.type = type;
        }
        if (status) {
            whereQuery.status = status;
        }
        const devices = await Device.findAll({
            where: whereQuery
        });
        if (!devices) {
            return res.status(404).json({ message: "No device created." });
        }
        res.status(200).json({ data: devices, message: "Success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Get device by id
const getDeviceById = async (req, res) => {
    const { id } = req.params;
    try {
        const device = await Device.findByPk(id); // Find by primary key
        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }
        res.status(200).json({ data: device, message: "Success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

//Create device
const createDevice = async (req, res) => {
    // const { id, name, type, status, description, productionDate } = req.body;
    const { id, name, code, topics } = req.body;
    try {
        // Create devices with different topicID
        topics.forEach(async (topic, index) => {
            const topicQuery = await Topic.findOne({
                where: {
                    TopicName: topic,
                }
            })
            if (!topicQuery || !topics) {
                return res.status(404).json({ message: `Topic not exists` });
            }
            await Device.create({
                DeviceName: name,
                DeviceID: id,
                DeviceCode: code[index],
                TopicID: topicQuery.TopicID
            });
        });
        res.status(201).json({ message: "Success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

// Update device
const updateDeviceData = async (req, res) => {
    const { id } = req.params;
    const { name, code, topic } = req.body;
    try {
        const device = await Device.findByPk(id); // Find by primary key
        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }
        const topicQuery = await Topic.findOne({
            where: {
                TopicName: topic,
            }
        });
        if (!topicQuery) {
            return res.status(404).json({ message: `Topic ${topic} not exists` });
        }
        await device.update({
            DeviceName: name,
            DeviceCode: code,
            TopicID: topicQuery.TopicID
        });
        res.status(200).json({ message: "Success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Delete device
const deleteDevice = async (req, res) => {
    const { id } = req.params;
    try {
        const device = await Device.findByPk(id); // Find by primary key
        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }
        await device.destroy();
        res.status(200).json({ message: "Success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getDevices,
    getDeviceById,
    createDevice,
    updateDeviceData,
    deleteDevice
};