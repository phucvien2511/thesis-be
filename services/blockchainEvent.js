const { ThirdwebSDK } = require("@thirdweb-dev/sdk");
const { getDailyLog } = require("./dataHandler");
require('dotenv').config();
// Get private key and contract address from environment variables
const privateKey = process.env.WALLET_PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;

const sdk = ThirdwebSDK.fromPrivateKey(
    privateKey,
    "binance-testnet"
);

const handleBlockchainEvent = async () => {
    const contract = await sdk.getContract(contractAddress);
    const getContractData = async () => {
        const sampleData = await getDailyLog();
        if (sampleData[0] === false) {
            return null;
        }
        const result = sampleData.map(item => {
            const splittedData = item.split(",");
            return [
                parseInt(splittedData[0]),
                false,
                parseInt(splittedData[2]),
            ];
        });
        return result;
    }
    const contractData = await getContractData();
    if (contractData) {
        await contract.call("checkout", [9, await getContractData()]);
    }
    else {
        console.log("No data found to checkout.");
    }
    // console.log("Private key: ", privateKey);
    // console.log("Contract address: ", contractAddress);
    // // retrive past events of checkout activities
    // const events = await contract.events.getEvents("Checkout")
    // console.log("Check out: ", events);

    //listen to a checkout event(in real time)
    // contract.events.addEventListener("Checkout", (event) => {
    //     const tokenId = parseInt(event.data.tokenId._hex, 16);
    //     console.log('Token ID', tokenId);
    //     console.log('__________');
    //     const devices = event.data.devices;
    //     // Iterate through all devices
    //     devices.forEach(device => {
    //         const deviceId = parseInt(device.deviceId._hex, 16);
    //         const status = device.status;
    //         const timestamp = parseInt(device.timestamp._hex, 16);

    //         console.log("Device ID:", deviceId);
    //         console.log("Status:", status);
    //         console.log("Timestamp:", timestamp);
    //         console.log("----------");
    //     });
    // });

}
module.exports = handleBlockchainEvent;
