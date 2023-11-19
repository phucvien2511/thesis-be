'use strict'

const express = require('express');
const router = express.Router();

const dataRoutes = require('./_dataRoutes');
const deviceRoutes = require('./_deviceRoutes');
const _BASE_URL = "/api";

router.use(_BASE_URL + "/topic", dataRoutes);

router.use(_BASE_URL + "/device", deviceRoutes);

module.exports = router;