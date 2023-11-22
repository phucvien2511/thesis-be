const Room = require('../models/roomModel');

const createRoom = async (req, res) => {
    const { id, name, description } = req.body;
    try {
        await Room.create({
            id,
            name,
            description
        });
        res.status(201).json({ message: "Success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const getRoomById = async (req, res) => {
    const { id } = req.params;
    try {
        const room = await Room.findOne({
            where: {
                id
            }
        });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.status(200).json({ data: room, message: "Success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const updateRoom = async (req, res) => {
    const { id } = req.params;
    const { name, description, cardId } = req.body;
    try {
        const room = await Room.findByPk(id); // Find by primary key
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        await room.update({
            name,
            description,
            cardId
        });
        res.status(200).json({ message: "Success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRoom,
    getRoomById,
    updateRoom,
};