const mongoose = require('mongoose');
let isConnected = false;

const connectDB = async (uri) => {
    if (isConnected) {
        console.log('MongoDB zaten bağlı.');
        return;
    }
    try {
        const connect = await mongoose.connect(uri);
        isConnected = true;
        console.log(`MongoDB Bağlandı: ${connect.connection.host}`);
    } catch (err) {
        console.error(`MongoDB Bağlantı Hatası: ${err}`);
        throw err;
    }
};
const disconnectDB = async () => {
    if (isConnected) {
        await mongoose.disconnect();
        isConnected = false;
        console.log('MongoDB bağlantısı kesildi.');
    }
};
module.exports = {connectDB, disconnectDB};