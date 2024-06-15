const http = require('http');
const Data = require('../models/dataModel');
const Device = require('../models/deviceModel');
const Topic = require('../models/topicModel');


const storeData = (topic, value) => {
    const options = {
        hostname: 'localhost',
        port: 8000,
        path: `/api/data/${topic}/create`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    //console.log('Value: ', value);
    const req = http.request(options, () => { });
    req.on('error', error => {
        console.error(error);
    });
    req.write(JSON.stringify({ value }));
    req.end();
}

// const storeData = async (topic, value) => {
//     const topicData = await Topic.findOne({
//         where: {
//             TopicName: topic
//         }
//     });

//     // if (!topicData) {
//     //     return false;
//     // }
//     if (topicData.TopicName === 'light') {
//         await publishData('LIGHT-CONTROL', value);
//     }
//     // Find the device belongs to the topic
//     const deviceData = await Device.findOne({
//         where: {
//             TopicID: topicData.TopicID
//         }
//     });
//     await Data.create({
//         Value: value,
//         DeviceCode: deviceData.DeviceCode,
//     });
// };

const storeCardId = (value) => {
    const options = {
        hostname: 'localhost',
        port: 8000,
        path: `/api/room/1/update`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const req = http.request(options, () => { });
    req.on('error', error => {
        console.error(error);
    });
    req.write(JSON.stringify({ cardId: value }));
    req.end();
}


module.exports = { storeData, storeCardId };