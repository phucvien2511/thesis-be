const mqtt = require('mqtt');
const { storeData } = require('../middlewares/storeData');
const { verifyData } = require('../middlewares/verifyData');

// Client info
const ACCESS_TOKEN = 'BKSmartHotel_jen4BBXaJp';
const USERNAME = 'bksmarthotel';
const FEED_ID = '/bk/smarthotel/devicemonitoring';

// Server info
const MQTT_BROKER = 'mqtt://mqttserver.tk:1883';

// Connect to MQTT broker
const startConnection = () => {
    const client = mqtt.connect(MQTT_BROKER, {
        username: USERNAME,
        password: ACCESS_TOKEN
    });

    // Check connection
    client.on('connect', () => {
        console.log('Connected to MQTT broker ' + MQTT_BROKER);
        client.subscribe(FEED_ID);
        console.log('Subscribed to topic ' + FEED_ID);
    });

    // Receive subscribe message
    client.on('message', (_, message) => {
        console.log('Received data: ' + message.toString());
        const receivedData = JSON.parse(message.toString());
        receivedData.forEach(dataItem => {
            const { topic, value } = dataItem;
            // Call API to store data
            if (verifyData(value)) {
                storeData(topic, value);
            }
            else {
                console.log('Received invalid data: ' + value);
            }

        });
    });
};

module.exports = { startConnection };