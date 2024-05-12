const Data = require('../models/dataModel');
const Topic = require('../models/topicModel');
// Get all data from topic
const { Op, literal } = require("sequelize");
const { publishData, publishToMqtt } = require('../services/mqtt');
const Device = require('../models/deviceModel');
const { EthCrypto_EncryptData, EthCrypto_DecryptData } = require('../services/dataHandler');

const getAllData = async (req, res) => {
    const { topic } = req.params;
    const { max, min } = req.query;
    try {
        const topicData = await Topic.findOne({
            where: {
                TopicName: topic
            }
        });

        if (!topicData) {
            return res.status(404).json({ message: "Topic not found" });
        }

        const deviceData = await Device.findAll({
            where: {
                TopicID: topicData.TopicID
            }
        });
        let resData = null;
        for (const device of deviceData) {
            const dataQuery = {
                DeviceCode: device.DeviceCode,
            };
            // if (max) {
            //     // Cast the dataQuery.Value to number
            //     dataQuery[Op.or].push(
            //         literal(`CAST(Value AS FLOAT) <= ${max}`),
            //     )

            // }
            // if (min) {
            //     dataQuery[Op.or].push(
            //         literal(`CAST(Value AS FLOAT) >= ${min}`),
            //     )
            // }

            resData = await Data.findAll({
                where: dataQuery,
            });
            if (!resData) {
                return res.status(404).json({ message: "No data found." });
            }
        }
        // Format response 
        let result = [];
        const formatResData = await Promise.all(resData.map(async (data) => {
            const decryptedValue = (await EthCrypto_DecryptData(data.Value)).split(",")[1];

            if (max) {
                if (decryptedValue <= max) {
                    result.push({
                        value: decryptedValue,
                        deviceCode: data.DeviceCode,
                        createdAt: data.createdAt
                    });
                }
            }
            if (min) {
                if (decryptedValue >= min) {
                    result.push({
                        value: decryptedValue,
                        deviceCode: data.DeviceCode,
                        createdAt: data.createdAt
                    });
                }
            }
            if (!max && !min) {
                result.push({
                    value: decryptedValue,
                    deviceCode: data.DeviceCode,
                    createdAt: data.createdAt
                });
            }

        }));

        res.status(200).json({ data: result, message: "Success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Get latest data from topic
const getLatestData = async (req, res) => {
    const { topic } = req.params;
    try {
        // Find the topic data
        const topicData = await Topic.findOne({
            where: {
                TopicName: topic
            }
        });

        if (!topicData) {
            return res.status(404).json({ message: "Topic not found" });
        }

        // Find all devices belongs to the topic
        const deviceData = await Device.findAll({
            where: {
                TopicID: topicData.TopicID
            }
        });
        let resData = null;
        for (const device of deviceData) {
            const tempResData = await Data.findOne({
                where: {
                    DeviceCode: device.DeviceCode,
                },
                order: [
                    ['createdAt', 'DESC']  // Find latest data 
                ]
            });
            if (!resData || tempResData.createdAt > resData.createdAt) {
                resData = tempResData;
            }
        }
        if (!resData) {
            return res.status(404).json({ message: "No data created." });
        }
        const formatResData = {
            value: (await EthCrypto_DecryptData(resData.Value)).split(",")[1],
            deviceCode: resData.DeviceCode,
            createdAt: resData.createdAt
        }
        res.status(200).json({ data: formatResData, message: "Success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Get data by id
// const getDataById = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const data = await Data.findByPk(id); // Find by primary key
//         if (!data) {
//             return res.status(404).json({ message: "Data not found" });
//         }
//         res.status(200).json({ data: data, message: "Success" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: error.message });
//     }
// };

// Create data
const createData = async (req, res) => {
    const { topic } = req.params;
    const { value } = req.body;
    try {
        const topicData = await Topic.findOne({
            where: {
                TopicName: topic
            }
        });

        if (!topicData) {
            return res.status(404).json({ message: "Topic not found" });
        }
        if (topicData.TopicName === 'light') {
            await publishData('LIGHT-CONTROL', value);
        }
        else if (topicData.TopicName.substring(0, 6) === 'socket') {
            const socketIndex = parseInt(topicData.TopicName.substring(7)) - 1;
            const prepareJson = {
                type: 'command',
                data: [
                    {
                        deviceName: 'RELAY',
                        roomId: "1",
                        action: parseInt(value) === 1 ? 'ON' : 'OFF',
                        index: socketIndex.toString(),
                    }
                ]
            };
            await publishToMqtt(JSON.stringify(prepareJson));
        }

        // Find the device belongs to the topic
        const deviceData = await Device.findOne({
            where: {
                TopicID: topicData.TopicID
            }
        });
        let prepareData = [deviceData.DeviceCode, value, Date.now()];
        prepareData = await EthCrypto_EncryptData(prepareData.toString());
        await Data.create({
            Value: prepareData,
            DeviceCode: deviceData.DeviceCode,
        });
        // console.log('Data created: ', prepareData.toString(), ' for device: ', deviceData.DeviceCode);
        // console.log('Decrypted: ', await EthCrypto_DecryptData(prepareData));
        res.status(201).json({ message: "Success" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

// Get data for chart
const getDataForChart = async (req, res) => {
    const { topic } = req.params;
    const { startTime, endTime, hours } = req.query;
    try {
        const topicData = await Topic.findOne({
            where: {
                TopicName: topic
            }
        });

        if (!topicData) {
            return res.status(404).json({ message: "Topic not found" });
        }

        const deviceData = await Device.findAll({
            where: {
                TopicID: topicData.TopicID
            }
        });
        let resData = null;
        for (const device of deviceData) {
            const chartDataQuery = {
                DeviceCode: device.DeviceCode,
            };
            if (startTime) {
                chartDataQuery.createdAt = {
                    [Op.gte]: Date.parse(startTime)
                };
            }
            if (endTime) {
                chartDataQuery.createdAt = {
                    ...chartDataQuery.createdAt,
                    [Op.lte]: Date.parse(endTime)
                };
            }
            // If there is startTime or endTime, ignore hours
            if (hours && !startTime && !endTime) {
                chartDataQuery.createdAt = {
                    [Op.gte]: Date.now() - (hours * 3600 * 1000)
                };
            }
            resData = await Data.findAll({
                where: chartDataQuery,
            });
            if (!resData) {
                return res.status(404).json({ message: "No data found." });
            }
        }
        // Format response 
        const formatResData = await Promise.all(resData.map(async (data) => {
            return {
                value: (await EthCrypto_DecryptData(data.Value)).split(",")[1],
                deviceCode: data.DeviceCode,
                createdAt: data.createdAt
            }
        }));
        res.status(200).json({ data: formatResData, message: "Success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const deleteData = async (req, res) => {
    const { topicName, id } = req.params;
    try {
        const topic = await Topic.findOne({
            where: { name: topicName }
        });

        if (!topic) {
            return res.status(404).json({ message: "Topic not found" });
        }
        const data = await Data.findByPk(id); // Find by primary key
        if (!data) {
            return res.status(404).json({ message: "Data ID not found" });
        }
        await data.destroy();
        res.status(200).json({ message: "Success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}
module.exports = {
    getAllData,
    getLatestData,
    createData,
    getDataForChart,
    deleteData,
};