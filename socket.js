const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { Client, RemoteAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
const cors = require('cors');
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: '*',
    }
});

// Require database
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');

// Setup environment variables
require('dotenv').config();

// WhatsApp clients map to store client instances by clientId
const whatsappClients = new Map();

// Function to initialize WhatsApp client with clientId
function initializeWhatsAppClient(clientId) {

    mongoose.connect(process.env.MONGODB_URI).then(() => {
        const store = new MongoStore({ mongoose: mongoose });
        const whatsappClient = new Client({
            authStrategy: new RemoteAuth({
                clientId: clientId,
                store: store,
                backupSyncIntervalMs: 300000
            })
        });
        
        whatsappClient.on('qr', (qr) => {
            qrcode.generate(qr, { small: true });
        });
        
        whatsappClient.on('ready', () => {
            console.log(`WhatsApp client (${clientId}) is ready`);
        });
        
        whatsappClient.on('message', (message) => {
            // Broadcast incoming messages to the corresponding WebSocket client
            io.to(clientId).emit('message-received', message);
        });
        
        whatsappClient.initialize();
        
        // Store the client instance in the map
        whatsappClients.set(clientId, whatsappClient);
    });

}

// WebSocket connection event
io.on('connection', (socket) => {
    console.log('A client connected');

    // Receive client ID from the client
    const clientId = socket.handshake.query.clientId;

    // Join the room corresponding to the client ID
    socket.join(clientId);

    // Initialize WhatsApp client if not already initialized
    if (!whatsappClients.has(clientId)) {
        initializeWhatsAppClient(clientId);
    }

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
