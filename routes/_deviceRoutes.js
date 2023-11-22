'use strict'

// Required libraries & files
const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

// Define routes here
router.get("", deviceController.getDevices);
router.get("/:id", deviceController.getDeviceById);
router.post("/create", deviceController.createDevice);
router.put("/update/:id", deviceController.updateDevice);
router.delete("/delete/:id", deviceController.deleteDevice);

module.exports = router;