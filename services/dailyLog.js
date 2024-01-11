const http = require('http');
const TOPICS = ['temperature', 'humidity', 'room-access'];
const MAX_RETRIES = 3;
const RETRY_INTERVAL = 60000; // 60 seconds every retry

const getDailyLog = () => {
    let retries = 0;

    const fetchData = (topic) => {
        const options = {
            hostname: 'localhost',
            port: 8000,
            path: `/api/topic/${topic}/data/chart?hours=24`,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            console.log(`statusCode: ${res.statusCode}`);

            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const jsonData = JSON.parse(data);
                console.log(jsonData.data);
            });
        });

        req.on('error', (error) => {
            console.error(error);
            retries++;
            if (retries <= MAX_RETRIES) {
                console.log(`Retrying (${retries}/${MAX_RETRIES})...`);
                setTimeout(() => fetchData(topic), RETRY_INTERVAL);
            } else {
                console.log(`Max retries exceeded for topic "${topic}".`);
            }
        });

        req.end();
    };

    TOPICS.forEach((topic) => {
        fetchData(topic);
    });
};

module.exports = getDailyLog;