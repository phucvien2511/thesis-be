'use strict'

// Required libraries & files
const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// Define routes here
router.get("/:topicName/data", dataController.getAllData);
router.get("/:topicName/data/latest", dataController.getLatestData);
router.post("/:topicName/data/create", dataController.createData);
// router.get("/:topicName/data/:id", dataController.getDataById);
router.get("/:topicName/data/chart", dataController.getDataForChart);
// router.put("/:topicName/data/update/:id", dataController.updateData);
router.delete("/:topicName/data/delete/:id", dataController.deleteData);

module.exports = router;