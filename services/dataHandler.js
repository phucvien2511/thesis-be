const Topic = require('../models/topicModel');
const Device = require('../models/deviceModel');
const Data = require('../models/dataModel');
const TOPICS = ['temperature']; // Topics included in daily log 
const EthCrypto = require('eth-crypto');
require('dotenv').config();
const decryptData = async (encryptedData) => {
    if (!encryptedData) {
        return false;
    }
    const decrypted = await EthCrypto.decryptWithPrivateKey(
        process.env.ETH_PRIVATE_KEY,
        encryptedData
    );
    return decrypted;
}

const encryptData = async (data) => {
    if (!data) {
        return false;
    }
    const encrypted = await EthCrypto.encryptWithPublicKey(
        process.env.ETH_PUBLIC_KEY,
        data
    );
    const storeEncrypted = await EthCrypto.cipher.stringify(encrypted);
    return storeEncrypted;
}

const getDailyLog = async () => {
    const fetchData = async (topic) => {
        const topicData = await Topic.findOne({
            where: {
                TopicName: topic
            }
        });

        if (!topicData) {
            return false;
        }

        // Find the device belongs to the topic
        const deviceData = await Device.findOne({
            where: {
                TopicID: topicData.TopicID
            }
        });

        const resData = await Data.findAll({
            where: {
                DeviceCode: deviceData.DeviceCode
            },
            // order: [
            //     ['createdAt', 'DESC']  // Find latest data 
            // ]
        });
        if (!resData) {
            return false;
        }
        return decryptData(resData.Value);
    }
    if (!fetchData) {
        return false;
    }
    const results = await Promise.all(TOPICS.map(fetchData));
    return results;
};

module.exports = {
    getDailyLog,
    encryptData,
    decryptData
};