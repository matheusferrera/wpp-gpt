import express, { Express, Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import { Client, RemoteAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'client_01';

const app: Express = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: '*',
    }
});

// Require database
import { MongoStore } from "wwebjs-mongo";
import mongoose from "mongoose";


// WhatsApp clients map to store client instances by clientId
const whatsappClients = new Map();

// Function to initialize WhatsApp client with clientId
function initializeWhatsAppClient(clientId: any) {

    mongoose.connect(MONGODB_URI).then(() => {
        const store = new MongoStore({ mongoose: mongoose });
        const whatsappClient = new Client({
            authStrategy: new RemoteAuth({
                clientId: clientId,
                store: store,
                backupSyncIntervalMs: 300000
            })
        });

        whatsappClient.on('loading_screen', (percent, message) => {
            console.log('loading whatsapp connection...', percent, message);
        });
    
        whatsappClient.on('authenticated', () => {
            console.log('client authenticated');
        });
    
        whatsappClient.on('auth_failure', msg => {
            // Fired if session restore was unsuccessful
            console.error('authentication failure', msg);
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

        whatsappClient.on('message_create', async message => {
            console.log("message from: " + message.from);
            console.log("message content: " + message.body);
        
            // if (message.body === '!ping') {
            //     // send back "pong" to the chat the message was sent in
            //     client.sendMessage(message.from, 'pong');
            // }
            // else if (message.body === '!chats') {
            //     const chats = await client.getChats();
            //     client.sendMessage(message.from, `The bot has ${chats.length} chats open.`);
            // }
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

    // Check existence of received clientId query
    if(clientId && typeof clientId !== "undefined") {
        // Join the room corresponding to the client ID
        socket.join(clientId);

        // Initialize WhatsApp client if not already initialized
        if (!whatsappClients.has(clientId)) {
            initializeWhatsAppClient(clientId);
        }
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
