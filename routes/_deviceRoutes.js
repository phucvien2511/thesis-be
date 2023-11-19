'use strict'

const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');


router.get("/all", deviceController.getAllDevices);

router.get("/:id", deviceController.getDeviceById);

router.post("/create", deviceController.createDevice);

router.put("/update/:id", deviceController.updateDevice);

router.delete("/delete/:id", deviceController.deleteDevice);

module.exports = router;