import express, { Express } from "express";
import http from "http";

import cors from "cors";
import dotenv from "dotenv";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import https from "https";
import fs from "fs";
import path from "path";

// API files
import wpp from "./routes/wpp";
import contacts from "./routes/contacts";
import auth from "./routes/auth";

// Environment variables configuration
dotenv.config();

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
        url: "https://api-china.work.gd",
        // url: "http://localhost:3000",
      },
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        LoginRequest: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
            },
            password: {
              type: "string",
              format: "password",
            },
          },
          required: ["email", "password"],
        },
        LoginResponse: {
          type: "object",
          properties: {
            token: {
              type: "string",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
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
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/wpp", wpp);
app.use("/contacts", contacts);
app.use('/auth', auth);

//========================================================================================
//================================>  Wpp client  <===================================
//========================================================================================
import { Client, LocalAuth, Message } from "whatsapp-web.js";

interface WhatsAppClientInstance {
  client: Client;
  qrCode: string;
  recentMessages: Map<string, Message[]>;
}

let whatsappClients: Map<string, WhatsAppClientInstance> = new Map();

// Função para inicializar um cliente WhatsApp
async function initializeWhatsAppClient(clientId: string): Promise<Client> {

  console.log("[INITIALIZING CLIENT]    =>   ClientId = ", clientId)

  const client = new Client({
    authStrategy: new LocalAuth({
      dataPath: `client_wpp_${clientId}`,
    }),
    puppeteer: {
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });

  
app.get('/puppeteer', async (req, res) => {
  const page = client.pupPage;
  if (!page) {
    throw new Error("pupPage is undefined");
  }
  const content = await page.content();

  res.send(content); // Enviar o conteúdo HTML como resposta
});

  const clientInstance: WhatsAppClientInstance = {
    client,
    qrCode: "",
    recentMessages: new Map(),
  };

  client.on("authenticated", () => {
    console.log(`[initializeWhatsAppClient ${clientId}] => Client authenticated`);
  });

  client.on("auth_failure", (msg) => {
    console.log(`[initializeWhatsAppClient ${clientId}] => Auth failure: ${msg}`);
  });

  client.on("qr", (qr) => {
    console.log(`[initializeWhatsAppClient ${clientId}] => Generated qr-code`);
    clientInstance.qrCode = qr;
  });

  client.on("ready", () => {
    console.log(
      `\u001b[34m[initializeWhatsAppClient ${clientId}] => Client is READY \u001b[0m`
    );
  });

  client.on("message", (message: Message) => {
    console.log(
      `\u001b[34m[WhatsAppClient ${clientId}] => \u001b[22mReceived message \u001b[0m`,
      message.id.remote
    );

    // Store the message in the recentMessages Map
    const chatId = message.from;
    if (!clientInstance.recentMessages.has(chatId)) {
      clientInstance.recentMessages.set(chatId, []);
    }
    clientInstance.recentMessages.get(chatId)?.push(message);

    //A cada nova mensagem o buffer espera 60 segundos verifica se a ultima mensagem tem 60 segundos
    setTimeout(() => {
      const messages = clientInstance.recentMessages.get(chatId);
      if (messages) {
        const currentTime = Date.now();
        const lastMessage = messages[messages.length - 1];
        const timeSinceLastMessage = currentTime - lastMessage.timestamp * 1000;
  
        //Verifica se faz mais de 1 minuto desde o envio da ultima mensagem
        if (timeSinceLastMessage >= 60000) {
          console.log(`Removing messages for chatId: ${chatId}`);
          messages.forEach((msg) => {
            console.log(`Removed Message ID: ${msg.id._serialized}`);
            console.log(`From: ${msg.from}`);
            console.log(`Body: ${msg.body}`);
            console.log('---');
          });
          clientInstance.recentMessages.delete(chatId);
        } else {
          console.log(`Skipping deletion for chatId: ${chatId}. Last message is too recent.`);
        }
      }
    }, 60000);
  });
  

  await client.initialize();
  whatsappClients.set(clientId, clientInstance);
  return client;
}

// Função para obter ou criar um cliente WhatsApp
async function getOrCreateWhatsAppClient(clientId: string): Promise<Client> {
  const existingClient = whatsappClients.get(clientId);
  if (existingClient) {
    return existingClient.client;
  }
  return initializeWhatsAppClient(clientId);
}

// Função para obter o QR code de um cliente específico
function getQRCode(clientId: string): string | undefined {
  return whatsappClients.get(clientId)?.qrCode;
}

export { getOrCreateWhatsAppClient, getQRCode };

//========================================================================================
//================================>  Queue config  <===================================
//========================================================================================

import { messageQueue, serverAdapter } from "./queue";

app.use("/admin/queues", serverAdapter.getRouter());

//========================================================================================
//================================>  INITIALIZE API  <===================================
//========================================================================================

// Certificado SSL e chave privada

if (process.env.PORT == "443") {
  const sslOptions = {
    key: fs.readFileSync("/etc/letsencrypt/live/api-china.work.gd/privkey.pem"),
    cert: fs.readFileSync(
      "/etc/letsencrypt/live/api-china.work.gd/fullchain.pem"
    ),
  };
  // Inicie o servidor em PROD
  const port = process.env.PORT || 443;
  const server = https.createServer(sslOptions, app);
  server.listen(port, () => {
    console.log(
      `\x1b[33m[server] => HTTPS Server is running on port ${port}\x1b[0m`
    );
  });
} else {
  // Inicie o servidor em DEV
  const port = process.env.PORT || 3000;
  const server = https.createServer(app);
  app.listen(port, () => {
    console.log(
      `\x1b[33m[server] => HTTPS Server is running on port ${port}\x1b[0m`
    );
  });
}

// Exports to use in other files
export { messageQueue };
