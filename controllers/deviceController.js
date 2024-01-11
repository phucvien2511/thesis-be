const Device = require('../models/deviceModel');
const { Op } = require("sequelize");

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
    const { id, name, type, status, description, productionDate } = req.body;
    try {
        await Device.create({
            id,
            name,
            type,
            status,
            description,
            productionDate
        });
        res.status(201).json({ message: "Success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

// Update device
const updateDevice = async (req, res) => {
    const { id } = req.params;
    const { name, type, status, description, productionDate, roomId } = req.body;
    try {
        const device = await Device.findByPk(id); // Find by primary key
        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }
        await device.update({
            name,
            type,
            status,
            description,
            productionDate,
            roomId
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
    updateDevice,
    deleteDevice
};