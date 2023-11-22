'use strict'

// Required libraries & files
const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');

// Define routes here
router.post("/create", topicController.createTopic);
router.get("", topicController.getTopics);
router.get("/:topicName", topicController.getTopicByName);
router.put("/update/:topicName", topicController.updateTopic);
router.delete("/delete/:topicName", topicController.deleteTopic);

module.exports = router;
