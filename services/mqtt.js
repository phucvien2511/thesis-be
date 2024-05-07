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
        console.log('-> CONNECTED TO MQTT BROKER AT ' + MQTT_BROKER + '.');
        client.subscribe(MQTT_TOPIC);
        console.log('-> SUBSCRIBED TO TOPIC ' + MQTT_TOPIC + '.');
        console.log('------------------------------------------------------');
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
        console.log('-> Received message from topic: ', message.toString());
        //console.log('-> Message type: ', receivedMessage.type);
        // if (!Array.isArray(receivedMessage)) {
        //     // Make it into an array
        //     receivedMessage = [receivedMessage];
        // }

        if (receivedMessage.type === 'publish') {
            console.log('-> Received data array: ', receivedMessage.data);
            receivedMessage.data.forEach(item => {
                const { topic, value } = item;
                //console.log('-> Received data: ', { topic, value })
                storeData(topic, value);
                myEvent.emit('receive_data', { topic, value });
            });
        }
        // receivedMessage.forEach(dataItem => {
        //     const { topic, value } = dataItem;
        //     // Call API to store data
        //     // if (topic !== 'room-access') {
        //     //     storeData(topic, value);
        //     // } else {
        //     //     storeCardId(value);
        //     //     console.log("Store card id");
        //     // }

        //     // if (verifyData(value)) {
        //     //     storeData(topic, value);
        //     // }
        //     if (topic === 'room-access') {
        //         // myEvent.emit('room-access', value);
        //     }
        //     else {
        //         storeData(topic, value);
        //         // console.log('Emit receive_data event');
        //         myEvent.emit('receive_data', { topic, value });
        //     }
        // });
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
        const publishData = prepareJsonToPublish(type, payload);
        client.publish(MQTT_TOPIC, publishData);
        console.log('-> Published to: ' + MQTT_TOPIC + '.');
        console.log('-> Payload: ' + publishData + '.');
    } else {
        console.log('-> Publish failed: Client is not connected.');
    }
};


module.exports = { startConnection, publishData };