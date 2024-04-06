import express, { Express, Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import { Client, RemoteAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import cors from "cors";
import dotenv from "dotenv";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// API files
import messages from './routes/messages';
import clients from './routes/clients';

// Environment variables configuration
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'client_01';

const app: Express = express();

// Swagger UI configuration
const options = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "WhatsApp Automation API",
        version: "0.1.0",
        description:
          "This is a WhatsApp Automation API made with Express and documented with Swagger",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "Matheus Ferreira",
          url: "https://matheusferrera.com",
          email: "info@email.com",
        },
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
    },
    apis: ["**/routes/*.ts"],
};

// Swagger UI route
const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

// API Routes
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use('/messages', messages);
app.use('/clients', clients);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: '*',
    }
});

// Require database
import { MongoStore } from "wwebjs-mongo";
import mongoose from "mongoose";

// MongoDB Models
import Message from "./models/Message";
import User from "./models/User";
import ClientModel from "./models/Client";

// MongoDB connection
mongoose.connect(MONGODB_URI);
const db = mongoose.connection;
const store = new MongoStore({ mongoose: mongoose });


db.once('open', async () => {
    console.log('Connected to MongoDB');

    // Get all clients from DB
    const savedClients = await ClientModel.find();

    // Initialize all WhatsApp clients
    savedClients.forEach((client) => {
        console.log("saved client found: ");
        console.log(client);
        const clientId = client["clientId"];
        // Initialize WhatsApp client if not already initialized
        if (!whatsappClients.has(clientId)) {
            initializeWhatsAppClient(clientId);
        }
    });

    // Create a change stream on the Message collection
    const changeStream = Message.watch();

    // Listen for change events
    changeStream.on('change', (change) => {
        // console.log('Change detected:', change);

        // Emit a socket event or perform any action based on the change
    });
});

// Handle MongoDB connection errors
db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});


// WhatsApp clients map to store client instances by clientId
export const whatsappClients = new Map();

// Function to initialize WhatsApp client with clientId
function initializeWhatsAppClient(clientId: any) {

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
        // Find the user by userId
        ClientModel.findOneAndUpdate(
            { clientId: clientId  },
            { upsert: true, new: true }
        )
        .then((client) => {
            console.log('New client saved successfully:', clientId);
        })
        .catch((error) => {
            console.error('Error saving new client:', error);
        });
    });

    whatsappClient.on('auth_failure', msg => {
        // Fired if session restore was unsuccessful
        console.error('authentication failure', msg);
    });
    
    whatsappClient.on('qr', (qr) => {
        // qrcode.generate(qr, { small: true });
        console.log("Generated QRCode for " + clientId);
        app.get(`/qrcode/${clientId}`, async (req: Request, res: Response) => {
            try {
                res.send({"code": qr});
            } catch (e: any) {
                res.status(500).send(e.toString());
            }
        });
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

        const userId = message.from;

        // Ignore status messages
        if(userId !== "status@broadcast") {
            // Create a new message document
            const newMessage = new Message(message);

            // Save the message document to the collection
            newMessage.save()
            .then(savedMessage => {
                // console.log('Message saved successfully:', savedMessage);
                // Perform any additional actions if needed
            })
            .catch(error => {
                console.error('Error saving message:', error);
                // Handle the error appropriately
            });

            // Find the user by userId
            User.findOneAndUpdate(
                { userId: userId, clientId: clientId },
                { $push: { messages: newMessage } },
                { upsert: true, new: true }
            )
            .then((user) => {
                // console.log('Message saved successfully for user:', user);
            })
            .catch((error) => {
                console.error('Error saving message for user:', error);
            });
        
            // if (message.body === '!ping') {
            //     // send back "pong" to the chat the message was sent in
            //     client.sendMessage(message.from, 'pong');
            // }
            // else if (message.body === '!chats') {
            //     const chats = await client.getChats();
            //     client.sendMessage(message.from, `The bot has ${chats.length} chats open.`);
            // }
        }
    });
    
    whatsappClient.initialize();
    
    // Store the client instance in the map
    whatsappClients.set(clientId, whatsappClient);

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
