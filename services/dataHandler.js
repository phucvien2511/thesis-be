const Topic = require('../models/topicModel');
const Device = require('../models/deviceModel');
const Data = require('../models/dataModel');
const TOPICS = ['temperature']; // Topics included in daily log 
const EthCrypto = require('eth-crypto');
const CryptoJS = require('crypto-js');
require('dotenv').config();
const EthCrypto_DecryptData = async (encryptedData) => {
    if (!encryptedData) {
        return false;
    }
    const decrypted = await EthCrypto.decryptWithPrivateKey(
        process.env.ETH_PRIVATE_KEY,
        encryptedData
    );
    return decrypted;
}

const EthCrypto_EncryptData = async (data) => {
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

const CryptoJS_EncryptData = (data) => {
    const secretKey = process.env.HIEN_SECRET_KEY; // 32 bytes (256 bits) key for AES-256
    const jsonData = JSON.stringify(data);
    const encryptedData = CryptoJS.AES.encrypt(jsonData, secretKey).toString();
    return encryptedData;
}

const CryptoJS_DecryptData = (encryptedData) => {
    const secretKey = process.env.WALLET_PRIVATE_KEY; // 32 bytes (256 bits) key for AES-256
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
}
const CryptoJS_HashData = (data) => {
    return '0x' + CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex).padStart(64, '0');
}

const getLog = async (roomId) => {
    const fetchLog = async () => {
        // Get all topics in the room
        const topics = await Topic.findAll({
            where: {
                RoomID: roomId,
            },
        });

        if (!topics) {
            return false;
        }

        let resultData = [];

        // Get all devices and data for each topic
        for (const topic of topics) {
            const devices = await Device.findAll({
                where: {
                    TopicID: topic.TopicID,
                },
            });

            for (const device of devices) {
                const resData = await Data.findAll({
                    where: {
                        DeviceCode: device.DeviceCode,
                    },
                });

                if (resData) {
                    for (const item of resData) {
                        const decryptedData = await EthCrypto_DecryptData(item.Value);
                        resultData.push(decryptedData);
                        // console.log('Result Data', resultData);
                    }
                }
            }
        }

        return resultData;
    };

    // const results = await Promise.resolve(fetchLog());
    const results = await fetchLog();
    if (!results) {
        return false;
    }
    // console.log('results', await EthCrypto_EncryptData(results[0].value));
    // console.log('results', results)
    return results;
};

module.exports = {
    getLog,
    CryptoJS_HashData,
    EthCrypto_EncryptData,
    EthCrypto_DecryptData,
    CryptoJS_EncryptData,
    CryptoJS_DecryptData,
};