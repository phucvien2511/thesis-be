const Data = require('../models/dataModel');
const Topic = require('../models/topicModel');
// Get all data from topic
const { Op } = require("sequelize");
const { publishData } = require('../services/mqtt');

const getAllData = async (req, res) => {
    const { topicName } = req.params;
    const { minValue, maxValue } = req.query;
    try {
        const topic = await Topic.findOne({
            where: { name: topicName }
        });

        if (!topic) {
            return res.status(404).json({ message: "Topic not found" });
        }
        const whereQuery = {
            topicId: topic.id,
        };
        if (minValue) {
            whereQuery.value = { [Op.gte]: minValue };
        }
        if (maxValue) {
            whereQuery.value = { ...whereQuery.value, [Op.lte]: maxValue };
        }
        // Remove the topic from data object
        const data = await Data.findAll({
            where: whereQuery,
            attributes: { exclude: ['topicId'] }
        });
        if (!data) {
            return res.status(404).json({ message: "No data found." });
        }
        res.status(200).json({ data: data, message: "Success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


// Get latest data from topic
const getLatestData = async (req, res) => {
    const { topicName } = req.params;
    try {
        const topic = await Topic.findOne({
            where: { name: topicName }
        });

        if (!topic) {
            return res.status(404).json({ message: "Topic not found" });
        }
        const whereQuery = {
            topicId: topic.id,
        };
        const data = await Data.findOne({
            where: {
                topicId: topic.id
            },
            order: [['createdAt', 'DESC']] // Find latest data from topic
        });
        if (!data) {
            return res.status(404).json({ message: "No data created." });
        }
        res.status(200).json({ data: data, message: "Success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Get data by id
const getDataById = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await Data.findByPk(id); // Find by primary key
        if (!data) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.status(200).json({ data: data, message: "Success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Create data
const createData = async (req, res) => {
    const { topicName } = req.params;
    const { value } = req.body;
    try {
        const topic = await Topic.findOne({
            where: { name: topicName }
        });

        if (!topic) {
            return res.status(404).json({ message: "Topic not found" });
        }
        if (topicName === 'light') {
            await publishData('LIGHT-CONTROL', value);
        }
        await Data.create({
            value,
            topicId: topic.id,
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
    const { topicName } = req.params;
    const { startTime, endTime, hours } = req.query;
    try {
        const topic = await Topic.findOne({
            where: { name: topicName }
        });

        if (!topic) {
            return res.status(404).json({ message: "Topic not found" });
        }
        const whereQuery = {
            topicId: topic.id,
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
        // If there is startTime and endTime, ignore hours
        if (hours && !startTime && !endTime) {
            whereQuery.createdAt = {
                [Op.gte]: Date.now() - (hours * 3600 * 1000)
            };
        }
        const data = await Data.findAll({
            where: whereQuery,
        });
        if (!data) {
            return res.status(404).json({ message: "No data found." });
        }
        // Format response 
        const formattedData = data.map(item => ({
            value: item.value,
            createdAt: item.createdAt
        }));
        res.status(200).json({ data: formattedData, message: "Success" });
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
    // getDataById,
    createData,
    getDataForChart,
    deleteData,
};