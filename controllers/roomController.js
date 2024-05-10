const Room = require('../models/roomModel');
const { publishData, publishToMqtt } = require('../services/mqtt');
const myEvent = require('../services/eventGenerator');
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
        // Update ownerId in room
        await room.update({
            AccessKey: ownerId,
        });
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
        res.status(200).json({ message: "Success" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const scanRfid = async (req, res) => {
    const { roomId } = req.body;
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
                    action: "SCAN_RFID_CARD",
                }
            ]
        }
        publishToMqtt(JSON.stringify(prepareJson));
        let result = -1;
        // // Know when there is a response from mqtt
        myEvent.once('room-access', (value) => {
            result = value;
            console.log('Room access event: ', value);
            res.status(200).json({ data: result, message: "Success" });

        });
        // //Delay 10 seconds to wait for response
        // setTimeout(() => {
        //     // Remove listener
        //     myEvent.removeAllListeners('room-access');
        //     if (result === -1) {
        //         res.status(200).json({ data: result, message: "No card scanned" });
        //     }
        // }, 10000);
        // let timeout;
        // const handleResponse = (value) => {
        //     clearTimeout(timeout); // Clear the timeout when the response is received
        //     result = value;
        //     console.log('Room access event:', value);
        //     res.status(200).json({ data: result, message: 'Success' });
        // };

        // myEvent.on('room-access', handleResponse);

        // timeout = setTimeout(() => {
        //     myEvent.removeListener('room-access', handleResponse); // Remove the event listener
        //     console.log('Timeout reached');
        //     res.status(500).json({ error: 'Timeout reached' });
        // }, 10000);
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