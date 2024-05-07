const myEvent = require("./eventGenerator");

module.exports = (io, socket) => {
    const handleDisconnect = () => {
        console.log('-> SOCKET: A user disconnected.');
        myEvent.removeAllListeners('receive_data');
    };
    const handleReceiveData = data => {
        console.log('-> SOCKET: Data received: ' + data + '.');
        io.emit('receive_data', data.topic, data.value, Date.now());
    }
    myEvent.on('receive_data', handleReceiveData);


    // socket.on('receive_data', handleReceiveData);
    socket.on('disconnect', handleDisconnect);


}