'use strict'

// Required libraries & files
const express = require('express');
const router = express.Router();

// Define base API URL
const _BASE_URL = "/api";

// Define routes here
const dataRoutes = require('./_dataRoutes');
const deviceRoutes = require('./_deviceRoutes');
// const userRoutes = require('./_userRoutes');
const topicRoutes = require('./_topicRoutes');
const roomRoutes = require('./_roomRoutes');

// Route configuration
router.use(_BASE_URL + "/data", dataRoutes);
router.use(_BASE_URL + "/device", deviceRoutes);
// router.use(_BASE_URL + "/user", userRoutes);
router.use(_BASE_URL + "/topic", topicRoutes);
router.use(_BASE_URL + "/room", roomRoutes);

module.exports = router;