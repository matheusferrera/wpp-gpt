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

    client.on('loading_screen', (percent, message) => {
        console.log('LOADING SCREEN', percent, message);
    });

    client.on('authenticated', () => {
        console.log('AUTHENTICATED');
    });

    client.on('auth_failure', msg => {
        // Fired if session restore was unsuccessful
        console.error('AUTHENTICATION FAILURE', msg);
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

    client.on('disconnected', (reason) => {
        console.log('Client was logged out', reason);
    });

    client.on('message', async msg => {
        console.log('MESSAGE RECEIVED', msg);

        if (msg.body === '!chats') {
            const chats = await client.getChats();
            client.sendMessage(msg.from, `The bot has ${chats.length} chats open.`);
        }
    });
    
    // Listening to all incoming messages
    client.on('message_create', async message => {
        console.log(message.body);
        console.log("FROM: " + message.from);
    
        if (message.body === '!ping') {
            // send back "pong" to the chat the message was sent in
            client.sendMessage(message.from, 'pong');
        }
        else if (message.body === '!chats') {
            const chats = await client.getChats();
            client.sendMessage(message.from, `The bot has ${chats.length} chats open.`);
        }
    });

    client.initialize();
});
