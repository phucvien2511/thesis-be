const Room = require('../models/roomModel');
const { publishData, publishToMqtt } = require('../services/mqtt');
const myEvent = require('../services/eventGenerator');
const { storeData } = require('../middlewares/storeData');
const createRoom = async (req, res) => {
    const { name, accessKey, description, status } = req.body;
    try {
        const room = await Room.findOne({
            where: {
                RoomName: name
            }
        });
        if (room) {
            return res.status(400).json({ message: "Room already exists" });
        }
        await Room.create({
            RoomName: name,
            AccessKey: accessKey,
            RoomDescription: description,
            RoomStatus: status
        });
        res.status(201).json({ message: "Success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}
const getRooms = async (req, res) => {
    const { status } = req.query;
    try {
        const rooms = await Room.findAll();
        if (status) {
            const filterRooms = rooms.filter((room) => room.RoomStatus.toLowerCase() === status.toLowerCase());
            return res.status(200).json({ data: filterRooms, message: "Success" });
        }
        res.status(200).json({ data: rooms, message: "Success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
const getRoomById = async (req, res) => {
    const { id } = req.params;
    try {
        const room = await Room.findOne({
            where: {
                RoomID: id,
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

const updateRoomData = async (req, res) => {
    const { id } = req.params;
    const { name, accessKey, description } = req.body;
    try {
        const room = await Room.findByPk(id); // Find by primary key
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        await room.update({
            RoomName: name,
            AccessKey: accessKey,
            RoomDescription: description,
        });
        res.status(200).json({ message: "Success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const registerRfid = async (req, res) => {
    const { roomId, ownerId } = req.body;
    try {
        const room = await Room.findByPk(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        const prepareJson = {
            type: 'command',
            data: [
                {
                    deviceName: "RFID",
                    roomId: roomId,
                    action: "WRITE_RFID_CARD",
                    value: ownerId
                }
            ]
        }
        publishToMqtt(JSON.stringify(prepareJson));
        // waiting for emit room_access_response
        let resultPromise = new Promise((resolve, reject) => {
            myEvent.once('room_access_response', (value) => {
                console.log('Room access event:', value);
                resolve(value);
            });

        });
        // myEvent.removeAllListeners('room_access_response');
        let result = await resultPromise;
        if (result === 1) {
            await room.update({
                AccessKey: ownerId,
            });
        }

        res.status(200).json({ data: { result }, message: "Success" });

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const scanRfid = async (req, res) => {
    const { roomId, value } = req.body;
    try {
        const room = await Room.findByPk(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        // console.log('Room: ', room.dataValues.cardId);
        // Get cardId from room
        const cardId = room?.dataValues?.cardId;
        // Send command to mqtt
        // publishData('COMMAND', {
        //     'module': 'rfid',
        //     'cardId': cardId
        // });
        const prepareJson = {
            type: 'command',
            data: [
                {
                    deviceName: "RFID",
                    roomId: roomId,
                    action: "READ_RFID_CARD",
                    value: value,
                }
            ]
        }
        publishToMqtt(JSON.stringify(prepareJson));
        // waiting for emit room_access_response
        let resultPromise = new Promise((resolve, reject) => {
            myEvent.once('auth_access_response', (value) => {
                resolve(value);
            });

        });
        // myEvent.removeAllListeners('room_access_response');
        let result = await resultPromise;
        storeData('room-access', result);
        res.status(200).json({ data: { result }, message: "Success" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRoom,
    getRooms,
    getRoomById,
    updateRoomData,
    registerRfid,
    scanRfid
};