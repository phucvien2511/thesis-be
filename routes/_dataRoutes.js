'use strict'

// Required libraries & files
const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

// Define routes here
router.get("/:topic/all", dataController.getAllData);
router.get("/:topic/latest", dataController.getLatestData);
router.post("/:topic/create", dataController.createData);
router.get("/:topic/chart", dataController.getDataForChart);
router.delete("/:topic/delete/:id", dataController.deleteData);

module.exports = router;