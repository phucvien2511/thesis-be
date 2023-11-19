const Device = require('../models/deviceModel');

// Get all devices
const getAllDevices = async (req, res) => {
    try {
        const devices = await Device.findAll(); // Find all devices
        if (!devices) {
            return res.status(404).json({ error: "No device created." });
        }
        res.status(200).json(devices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Get device by id
const getDeviceById = async (req, res) => {
    const { id } = req.params;
    try {
        const device = await Device.findByPk(id); // Find by primary key
        if (!device) {
            return res.status(404).json({ error: "Device not found" });
        }
        res.status(200).json(device);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

//Create device
const createDevice = async (req, res) => {
    const { id, name, type, status, description, productionDate } = req.body;
    try {
        const device = await Device.create({
            id,
            name,
            type,
            status,
            description,
            productionDate
        });
        res.status(201).json(device);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

// Update device
const updateDevice = async (req, res) => {
    const { id } = req.params;
    const { name, type, status, description, productionDate } = req.body;
    try {
        const device = await Device.findByPk(id); // Find by primary key
        if (!device) {
            return res.status(404).json({ error: "Device not found" });
        }
        await device.update({
            name,
            type,
            status,
            description,
            productionDate
        });
        res.status(200).json(device);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Delete device
const deleteDevice = async (req, res) => {
    const { id } = req.params;
    try {
        const device = await Device.findByPk(id); // Find by primary key
        if (!device) {
            return res.status(404).json({ error: "Device not found" });
        }
        await device.destroy();
        res.status(200).json({ message: "Device deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllDevices,
    getDeviceById,
    createDevice,
    updateDevice,
    deleteDevice
};