const { ThirdwebSDK, encodeConstructorParamsForImplementation } = require("@thirdweb-dev/sdk");
const { CryptoJS_HashData, getLog, CryptoJS_EncryptData } = require("./dataHandler");
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
        console.log('Token ID', tokenId);
        console.log('Room ID', roomId);
        const logData = (await getLogForCheckout(roomId)).slice(0, 100);
        if (logData) {
            console.log('Log data:', logData);
            const encryptedData = CryptoJS_EncryptData(logData);
            const hashedData = CryptoJS_HashData(JSON.stringify(logData));
            // console.log('Encrypted data:', CryptoJS_EncryptData(logData));
            // console.log('Hashed data:', CryptoJS_HashData(JSON.stringify(logData)));
            await contractWriter.call("sendData", [event.data.tokenId, encryptedData, hashedData]);
        }
        else {
            console.log("No data found to checkout.");
        }


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
    });
}
module.exports = handleBlockchainEvent;


