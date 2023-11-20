'use strict';

// Required libraries & files
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
const mqttService = require('./services/mqtt');

// .env configuration
require('dotenv').config()
const port = process.env.PORT || 8000;

// Define express app
const app = express();

// app configuration
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route configuration
app.use(routes);

app.use((req, res) => {
    res.status(404).send({ url: req.originalUrl + ' not found' })
});

mqttService.startConnection();

app.listen(port, () => {
    console.log('Back-end server started on port: ' + port);
});

