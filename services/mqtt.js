const mqtt = require('mqtt');
const { storeData, storeCardId } = require('../middlewares/storeData');
// const { verifyData } = require('../middlewares/verifyData');
const myEvent = require('./eventGenerator');
require('dotenv').config();
// const selectAdafruit = 0;

// // mqttserver.tk
// if (!selectAdafruit) {
//     ACCESS_TOKEN = 'BKSmartHotel_jen4BBXaJp';
//     USERNAME = 'bksmarthotel';
//     TOPIC = '/bk/smarthotel/devicemonitoring';
//     MQTT_BROKER = 'mqtt://mqttserver.tk:1883';
// }
let client = null;
let MQTT_PASSWORD = process.env.MQTT_PASSWORD;
let MQTT_USERNAME = process.env.MQTT_USERNAME;
let MQTT_TOPIC = process.env.MQTT_TOPIC + '/' + process.env.MAC_ADDRESS + '/+';
let MQTT_BROKER = process.env.MQTT_BROKER;
// Connect to MQTT broker
const startConnection = () => {
    client = mqtt.connect(MQTT_BROKER, {
        username: MQTT_USERNAME,
        password: MQTT_PASSWORD
    });

    // Check connection
    client.on('connect', () => {
        console.log('Connected to MQTT broker ' + MQTT_BROKER);
        client.subscribe(MQTT_TOPIC);
        console.log('Subscribed to topic ' + MQTT_TOPIC);
    });

    let isFirstMessageRemoved = false;

    // Receive subscribe message
    client.on('message', (_, message) => {
        if (!isFirstMessageRemoved) {
            isFirstMessageRemoved = true;
            // console.log('Retain message:', message.toString());
            return; // Skip saving first message (retain message)
        }

        let receivedMessage = JSON.parse(message.toString());
        console.log('Received message:', message.toString());

        if (!Array.isArray(receivedMessage)) {
            // Make it into an array
            receivedMessage = [receivedMessage];
        }

        receivedMessage.forEach(dataItem => {
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
                // myEvent.emit('room-access', value);
            }
            else {
                storeData(topic, value);
                console.log('Emit receive_data event');
                myEvent.emit('receive_data', { topic, value });
            }
        });
    });
};

const prepareJsonToPublish = (type, value) => {
    const data = {
        type,
        value
    };
    return JSON.stringify(data);
}
const publishData = (type, payload) => {
    if (client) {
        client.publish(MQTT_TOPIC, prepareJsonToPublish(type, payload));
    } else {
        console.log('Client is not connected.');
    }
};


module.exports = { startConnection, publishData };