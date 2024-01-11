const http = require('http');


const storeData = (topic, value) => {

    const options = {
        hostname: 'localhost',
        port: 8000,
        path: `/api/topic/${topic}/data/create`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const req = http.request(options, () => { });
    req.on('error', error => {
        console.error(error);
    });
    req.write(JSON.stringify({ value }));
    req.end();
}



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