import express, { Express, Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import cors from "cors";
import dotenv from "dotenv";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// API files
import messages from "./routes/messages";
import clients from "./routes/clients";

// Environment variables configuration
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "client_01";

//=======================================================================================
//===================================> API config <======================================
//=======================================================================================

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
  apis: ["**/swagger/*.yaml"],
};

// Swagger UI route
const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// API Routes
app.use(cors());
app.use(express.json());
app.use("/messages", messages);
app.use("/clients", clients);

//===============================================================================================
//================================> DB init / Initialize wpp <===================================
//===============================================================================================

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Require database
import { MongoStore } from "wwebjs-mongo";
import mongoose from "mongoose";

// MongoDB Models
import Message from "./models/Message";
import User from "./models/User";
import ClientModel from "./models/Client";
import ChatModel from "./models/Chat";

// MongoDB connection
mongoose.connect(MONGODB_URI);
const db = mongoose.connection;
const store = new MongoStore({ mongoose: mongoose });

db.once("open", async () => {
  console.log("Connected to MongoDB");

  // Create a change stream on the Message collection
  const changeStream = Message.watch();

  // Get all clients from DB
  const savedClients = await ClientModel.find();

  //Initialize all WhatsApp clients
  savedClients.forEach((client) => {
    const clientId = client["clientId"];
    console.log(
      `[initializeClientFunction] => Initializing client - ${client["clientId"]}`
    );
    // Initialize WhatsApp client if not already initialized
    if (!whatsappClients.has(clientId)) {
      initializeWhatsAppClient(clientId)
        .then((whatsappClient) => {
          console.log(
            `[initializeClientFunction] => Client initialized - ${client["clientId"]}`
          );
          console.log(
            `[initializeClientFunction] => Initializing sniffer - ${client["clientId"]}`
          );
          snifferWhatsAppClient(clientId, whatsappClient);
        })
        .then((sniffer) => {
          console.log(
            console.log(
              `[initializeClientFunction] => Sniffer initialized - ${client["clientId"]}`
            )
          );
        });
    }
  });

  // Listen for change events
  changeStream.on("change", (change) => {
    // console.log("Change detected:", change);
    console.log(`[snifferDB] => new modification DB`);
    console.log(change.ns);
    // Emit a socket event or perform any action based on the change
  });
});

// Handle MongoDB connection errors
db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

//========================================================================================
//================================>  Whatsapp config  <===================================
//========================================================================================

// WhatsApp clients map to store client instances by clientId
export const whatsappClients = new Map();

// Function to initialize WhatsApp client with clientId
async function initializeWhatsAppClient(clientId: any) {
  const whatsappClient = new Client({
    authStrategy: new LocalAuth({
      dataPath: clientId,
    }),
  });

  whatsappClient.on("loading_screen", (percent, message) => {
    console.log(
      `[initializeWhatsAppClient] => Loading whatsapp connection ${percent}% - ${clientId}`
    );
  });

  whatsappClient.on("authenticated", () => {
    console.log(
      `[initializeWhatsAppClient] => Client authenticated - ${clientId}`
    );
  });

  whatsappClient.on("auth_failure", (msg) => {
    console.log(`[initializeWhatsAppClient] => Auth_failure - ${clientId}`);
  });

  whatsappClient.on("qr", (qr) => {
    console.log(
      `[initializeWhatsAppClient] => Generated qr-code - ${clientId}`
    );
    qrcode.generate(qr, { small: true });
    console.log(qr);
  });

  whatsappClient.on("ready", () => {
    console.log(
      `\u001b[34m[initializeWhatsAppClient] => Client is READY!! - ${clientId}\u001b[0m`
    );
  });

  await whatsappClient.initialize();

  // Store the client instance in the map
  whatsappClients.set(clientId, whatsappClient);

  return whatsappClient;
}

async function snifferWhatsAppClient(clientId: any, whatsappClient: Client) {
  whatsappClient.on("message", (message) => {
    console.log(`[snifferWhatsAppClient] => Recive message - ${clientId}`);
    // Broadcast incoming messages to the corresponding WebSocket client
    io.to(clientId).emit("message-received", message);
  });

  whatsappClient.on("message_create", async (message) => {
    console.log(`[snifferWhatsAppClient] => Send message - ${clientId}`);
    const userId = message.from;

    // Ignore status messages
    if (userId !== "status@broadcast") {
      // Create a new message document
      const newMessage = new Message(message);

      // Save the message document to the collection

      newMessage
        .save()
        .then((savedMessage) => {
          console.log(
            `[snifferWhatsAppClient] => Save message into DB - ${clientId}`
          );
        })
        .catch((error) => {
          console.log(
            `[snifferWhatsAppClient ERROR] => Save message into DB - ${clientId} // ${error}`
          );
        });

      // Find the chat by clientId
      ChatModel.findOneAndUpdate(
        { remoteId: message.id.remote, clientId: clientId },
        { $push: { messages: newMessage } },
        { upsert: true, new: true }
      )
        .then((user) => {
          // console.log("Message saved successfully for user:", user);
          console.log(
            `[snifferWhatsAppClient] => Save chat into DB - ${clientId}`
          );
        })
        .catch((error) => {
          console.log(
            `[snifferWhatsAppClient ERROR] => Save message into DB - ${clientId} // ${error}`
          );
        });

    }
  });
}

// WebSocket connection event
io.on("connection", (socket) => {
  console.log("A client connected");

  // Receive client ID from the client
  const clientId = socket.handshake.query.clientId;

  // Check existence of received clientId query
  if (clientId && typeof clientId !== "undefined") {
    // Join the room corresponding to the client ID
    socket.join(clientId);

    // Initialize WhatsApp client if not already initialized
    if (!whatsappClients.has(clientId)) {
      initializeWhatsAppClient(clientId);
    }
  }

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
