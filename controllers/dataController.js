const Data = require('../models/dataModel');
const Topic = require('../models/topicModel');
// Get all data from topic
const { Op } = require("sequelize");
const { publishData } = require('../services/mqtt');
const Device = require('../models/deviceModel');

const getAllData = async (req, res) => {
    const { topic } = req.params;
    const { min, max } = req.query;
    try {
        const topicData = await Topic.findOne({
            where: {
                TopicName: topic
            }
        });

        if (!topicData) {
            return res.status(404).json({ message: "Topic not found" });
        }
        // Find the device belongs to the topic
        const deviceData = await Device.findOne({
            where: {
                TopicID: topicData.TopicID
            }
        });
        const whereQuery = {
            DeviceCode: deviceData.DeviceCode,
        };
        if (minValue) {
            whereQuery.Value = {
                [Op.gte]: min   // >= min
            };
        }
        if (maxValue) {
            whereQuery.Value = {
                ...whereQuery.Value,
                [Op.lte]: max   // <= max
            };
        }

        const resData = await Data.findAll({
            where: whereQuery,
            attributes: {
                exclude: ['DeviceCode']
            }
        });
        if (!resData) {
            return res.status(404).json({ message: "No data found." });
        }
        res.status(200).json({ data: resData, message: "Success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Get latest data from topic
const getLatestData = async (req, res) => {
    const { topic } = req.params;
    try {
        const topicData = await Topic.findOne({
            where: {
                TopicName: topic
            }
        });

        if (!topicData) {
            return res.status(404).json({ message: "Topic not found" });
        }

        // Find the device belongs to the topic
        const deviceData = await Device.findOne({
            where: {
                TopicID: topicData.TopicID
            }
        });

        const resData = await Data.findOne({
            where: {
                DeviceCode: deviceData.DeviceCode
            },
            order: [
                ['createdAt', 'DESC']  // Find latest data 
            ]
        });
        if (!resData) {
            return res.status(404).json({ message: "No data created." });
        }
        res.status(200).json({ data: resData, message: "Success" });
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

        // Find the device belongs to the topic
        const deviceData = await Device.findOne({
            where: {
                TopicID: topicData.TopicID
            }
        });
        await Data.create({
            Value: value,
            DeviceCode: deviceData.DeviceCode,
        });
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

        const deviceData = await Device.findOne({
            where: {
                TopicID: topicData.TopicID
            }
        });
        const whereQuery = {
            DeviceCode: deviceData.DeviceCode,
        };
        if (startTime) {
            whereQuery.createdAt = {
                [Op.gte]: Date.parse(startTime)
            };
        }
        if (endTime) {
            whereQuery.createdAt = {
                ...whereQuery.createdAt,
                [Op.lte]: Date.parse(endTime)
            };
        }
        // If there is startTime or endTime, ignore hours
        if (hours && !startTime && !endTime) {
            whereQuery.createdAt = {
                [Op.gte]: Date.now() - (hours * 3600 * 1000)
            };
        }
        const resData = await Data.findAll({
            where: whereQuery,
        });
        if (!resData) {
            return res.status(404).json({ message: "No data found." });
        }
        // Format response 
        const formattedResData = resData.map(item => ({
            value: item.Value,
            createdAt: item.createdAt
        }));
        res.status(200).json({ data: formattedResData, message: "Success" });
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