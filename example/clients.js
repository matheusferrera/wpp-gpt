const { Client, RemoteAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Require database
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');

// Setup environment variables
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(() => {
    const store = new MongoStore({ mongoose: mongoose });
    const client = new Client({
        authStrategy: new RemoteAuth({
            clientId: 'client_01',
            store: store,
            backupSyncIntervalMs: 300000
        })
    });
    client.on('authenticated', () => {
        console.log('AUTHENTICATED');
    });
    client.initialize();
    exports.client = client;
});
