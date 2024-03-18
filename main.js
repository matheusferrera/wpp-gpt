const { Client, RemoteAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Require database
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');

// Setup environment variables
require('dotenv').config();

// Load the session data
mongoose.connect(process.env.MONGODB_URI).then(() => {

    const store = new MongoStore({ mongoose: mongoose });
    const client = new Client({
        authStrategy: new RemoteAuth({
            clientId: 'client_01',
            store: store,
            backupSyncIntervalMs: 300000
        })
    });

    client.on('ready', () => {
        console.log('Client is ready!');
    });
    
    client.on('qr', qr => {
        qrcode.generate(qr, {small: true});
    });

    client.on('remote_session_saved', () => {
        console.log("session saved");
    });
    
    // Listening to all incoming messages
    client.on('message_create', message => {
        console.log(message.body);
    
        if (message.body === '!ping') {
            // send back "pong" to the chat the message was sent in
            client.sendMessage(message.from, 'pong');
        }
    });

    client.initialize();
});
