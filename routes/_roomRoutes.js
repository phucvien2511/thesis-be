'use strict'

// Required libraries & files
const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Define routes here
router.get("", roomController.getRooms);
router.get("/:id", roomController.getRoomById);
router.post("/create", roomController.createRoom);
router.put("/:id/update", roomController.updateRoomData);
router.put("/rfid/register", roomController.registerRfid);
router.put("/rfid/scan", roomController.scanRfid);

module.exports = router;