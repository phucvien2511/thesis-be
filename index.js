'use strict';

// Required libraries & files
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
const mqttService = require('./services/mqtt');
// const getDailyLog = require('./services/dailyLog');
const socketHandler = require('./services/socketHandler');
const { getLog } = require('./services/dataHandler');
const main = require('./services/blockchainEvent');
const handleBlockchainEvent = require('./services/blockchainEvent');

// .env configuration
require('dotenv').config();
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


const server = app.listen(port, () => {
    console.log('-> NODE SERVER: STARTED SUCCESSFULLY AT PORT ' + port + '.');
    console.log('------------------------------------------------------');
});

mqttService.startConnection();

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

const onConnection = (socket) => {
    console.log('-> SOCKET: New client connected');
    socketHandler(io, socket);

};

io.on('connection', onConnection);
// setInterval(async () => {
//     console.log('-> Get log result: ', await Promise.resolve(getLog(1)))
// }, 5000);
handleBlockchainEvent();