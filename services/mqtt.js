const mqtt = require('mqtt');
const { storeData, storeCardId } = require('../middlewares/storeData');
// const { verifyData } = require('../middlewares/verifyData');
const myEvent = require('./eventGenerator');
// Client info
const ACCESS_TOKEN = 'BKSmartHotel_jen4BBXaJp';
const USERNAME = 'bksmarthotel';
const FEED_ID = '/bk/smarthotel/devicemonitoring';

// Server info
const MQTT_BROKER = 'mqtt://mqttserver.tk:1883';

let client = null;

// Connect to MQTT broker
const startConnection = () => {
    client = mqtt.connect(MQTT_BROKER, {
        username: USERNAME,
        password: ACCESS_TOKEN
    });

    // Check connection
    client.on('connect', () => {
        console.log('Connected to MQTT broker ' + MQTT_BROKER);
        client.subscribe(FEED_ID);
        console.log('Subscribed to topic ' + FEED_ID);
    });

    let isFirstMessageRemoved = false;

    // Receive subscribe message
    client.on('message', (_, message) => {

        if (!isFirstMessageRemoved) {
            isFirstMessageRemoved = true;
            console.log('Retain message:', message.toString());
            return; // Skip the first message (retain message)
        }

        let receivedData = JSON.parse(message.toString());
        console.log('Received data:', message.toString());

        if (!Array.isArray(receivedData)) {
            // Make it into an array
            receivedData = [receivedData];
        }

        receivedData.forEach(dataItem => {
            const { topic, value } = dataItem;
            // Call API to store data
            // if (topic !== 'room-access') {
            //     storeData(topic, value);
            // } else {
            //     storeCardId(value);
            //     console.log("Store card id");
            // }

            // if (verifyData(value)) {
            //     storeData(topic, value);
            // }
            if (topic === 'room-access') {
                myEvent.emit('room-access', value);
            }
            else {
                storeData(topic, value);
            }
        });
    });
};

// const prepareJsonToPublish = (type, value) => {
//     return;
// }
const publishData = (type, payload) => {
    if (client) {
        client.publish(FEED_ID, JSON.stringify({
            type,
            value: payload
        }));
    } else {
        console.log('Client is not connected.');
    }
};


module.exports = { startConnection, publishData };