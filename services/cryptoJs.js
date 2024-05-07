const CryptoJS = require('crypto-js');
require('dotenv').config();
// Sample data
const data = [[0, 1, true], [2, 1, false]];

// Sample secret key
const secretKey = process.env.WALLET_PRIVATE_KEY; // 32 bytes (256 bits) key for AES-256

// Convert data to string
const jsonData = JSON.stringify(data);

// Encryption
const encryptedData = CryptoJS.AES.encrypt(jsonData, secretKey).toString();
console.log('Encrypted data:', encryptedData);

// Decryption
const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
console.log('Decrypted data:', decryptedData);