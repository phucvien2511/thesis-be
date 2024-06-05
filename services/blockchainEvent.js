const { ThirdwebSDK } = require("@thirdweb-dev/sdk");
const { CryptoJS_HashData, getLog, CryptoJS_EncryptData } = require("./dataHandler");
const Room = require("../models/roomModel");
require('dotenv').config();
// Get private key and contract address from environment variables
const privateKey = process.env.WALLET_PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;
const secretClientKey = process.env.CONTRACT_CLIENT_SECRET_KEY;
const clientId = process.env.CONTRACT_CLIENT_ID;

const listenSDK = new ThirdwebSDK("binance-testnet", {
    secretKey: secretClientKey,
    clientId: clientId,
});
const writeSDK = ThirdwebSDK.fromPrivateKey(
    privateKey,
    "binance-testnet"
);
// let contractListener, contractWriter;

const saveBookingData = async (roomId, renter) => {
    try {
        const room = await Room.findByPk(roomId); // Find by primary key
        if (!room) {
            console.log("Room not found. Is the room ID correct?");
            return;
        }
        if (room.RoomStatus === 'BOOKED') {
            console.log("This room was already booked.");
            return;
        }
        await room.update({
            RoomStatus: 'BOOKED',
            RoomOwner: renter,
        });
        return 1;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

const saveCheckoutData = async (roomId) => {
    try {
        const room = await Room.findByPk(roomId); // Find by primary key
        if (!room) {
            console.log("Room not found. Is the room ID correct?");
            return;
        }
        if (room.RoomStatus === 'AVAILABLE') {
            console.log("This room was already available.");
            return;
        }
        await room.update({
            RoomStatus: 'AVAILABLE',
            RoomOwner: null,
            AccessKey: null,
        });
    }
    catch (error) {
        console.error(error);
    }
}

const handleBlockchainEvent = async () => {
    const contractListener = await listenSDK.getContract(contractAddress);
    const contractWriter = await writeSDK.getContract(contractAddress);
    const getLogForCheckout = async (roomId) => {
        const sampleData = await getLog(roomId);
        if (sampleData[0] === false) {
            return null;
        }
        const result = sampleData.map(item => {
            const splittedData = item.split(",");
            return [
                parseInt(splittedData[0]),
                parseFloat(splittedData[1]),
                parseInt(splittedData[2]),
            ];
        });
        return result;
    }
    contractListener.events.addEventListener("Checkout", async (event) => {
        const tokenId = parseInt(event.data.tokenId._hex, 16);
        const roomId = parseInt(event.data.roomId._hex, 16);
        console.log('-> Checkout: Token ID', tokenId);
        console.log('-> Checkout: Room ID', roomId);
        const logData = (await getLogForCheckout(roomId));
        if (logData) {
            console.log('Log data:', logData);
            const encryptedData = CryptoJS_EncryptData(logData);
            const hashedData = CryptoJS_HashData(JSON.stringify(logData));
            // console.log('Encrypted data:', CryptoJS_EncryptData(logData));
            // console.log('Hashed data:', CryptoJS_HashData(JSON.stringify(logData)));
            await contractWriter.call("sendData", [event.data.tokenId, encryptedData, hashedData]);
            await saveCheckoutData(roomId);
        }
        else {
            console.log("No data found to checkout.");
        }
    });

    contractListener.events.addEventListener("Mint", async (event) => {
        const roomId = parseInt(event.data.roomId._hex, 16);
        const renter = event.data.renter;
        console.log('-> Mint: Room ID', roomId);
        console.log('-> Mint: Renter', renter);
        if (await saveBookingData(roomId, renter)) {
            console.log("Save room booking data successfully.");
        }
        else {
            console.log("Save room booking data failed.");
        }

    });


    // encryptedData, hashedData
    // encryptedData: Data -> encrypt eth-crypto -> Lưu DB -> decrypt eth-crypto -> Encrypt crypto-js
    // hashedData: decrypt eth-crypto -> hash crypto-js
    // const devices = event.data.devices;
    // // Iterate through all devices
    // devices.forEach(device => {
    //     const deviceId = parseInt(device.deviceId._hex, 16);
    //     const status = device.status;
    //     const timestamp = parseInt(device.timestamp._hex, 16);

    //     console.log("Device ID:", deviceId);
    //     console.log("Status:", status);
    //     console.log("Timestamp:", timestamp);
    //     console.log("----------");
    // });

}
module.exports = handleBlockchainEvent;


