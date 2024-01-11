const Topic = require('../models/topicModel');

// Create topic
const createTopic = async (req, res) => {
    const { name, description } = req.body;
    try {
        // Check if a topic with the same name already exists
        const existedTopic = await Topic.findOne({ where: { name } });
        if (existedTopic) {
            return res.status(400).json({ message: "Topic already exists" });
        }

        // Create a new topic
        await Topic.create({
            name,
            description
        });

        res.status(201).json({ message: "Success" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get topics
const getTopics = async (req, res) => {
    const { name } = req.query;
    try {
        const whereQuery = {};
        if (name) {
            whereQuery.name = { [Op.like]: `%${name}%` };
        }
        const topics = await Topic.findAll({ where: whereQuery });
        res.status(200).json({ data: topics, message: "Success" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get topic by name
const getTopicByName = async (req, res) => {
    const { topicName } = req.params;
    try {
        const topic = await Topic.findOne({ where: { name: topicName } });
        if (!topic) {
            return res.status(404).json({ message: "Topic not found" });
        }
        res.status(200).json({ data: topic, message: "Success" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update topic
const updateTopic = async (req, res) => {
    const { topicName } = req.params;
    const { name, description } = req.body;
    try {
        const topic = await Topic.findByPk({ name: topicName });
        if (!topic) {
            return res.status(404).json({ message: "Topic not found" });
        }
        await topic.update({ name, description });
        res.status(200).json({ message: "Success" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete topic
const deleteTopic = async (req, res) => {
    const { topicName } = req.params;
    try {
        const topic = await Topic.findByPk({ name: topicName });
        if (!topic) {
            return res.status(404).json({ message: "Topic not found" });
        }
        await topic.destroy();
        res.status(200).json({ message: "Success" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTopic,
    getTopics,
    getTopicByName,
    updateTopic,
    deleteTopic,
}