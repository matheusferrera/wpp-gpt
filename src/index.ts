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
import messages from "./routes/messages";
import wpp from "./routes/wpp";

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
        url: "http://13.49.74.201:3000",
        // url: "http://localhost:3000",
      },
      {
        url: "http://localhost:3000",
        // url: "http://localhost:3000",
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
app.use("/messages", messages);
app.use("/wpp", wpp);

//========================================================================================
//================================>  Wpp client  <===================================
//========================================================================================

import { Client, LocalAuth, Message } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import WhatsappUtil from "./util/whatsappUtil";

let whatsappClientInitialize: Client | null = null;
let whatsappClient: Promise<Client>;
let qrCodeWpp: string = "";

// Função para inicializar o cliente WhatsApp
async function initializeWhatsAppClient(): Promise<Client> {
  whatsappClientInitialize = new Client({
    authStrategy: new LocalAuth({
      dataPath: "client_wpp",
    }),
    puppeteer: {
      executablePath: "/usr/bin/chromium-browser",
      //headless: false, // Inicia o navegador e abre o wpp
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });

  whatsappClientInitialize.on("authenticated", () => {
    console.log(`[initializeWhatsAppClient] => Client authenticated`);
  });

  whatsappClientInitialize.on("auth_failure", (msg) => {
    console.log(`[initializeWhatsAppClient] => Auth failure: ${msg}`);
  });

  whatsappClientInitialize.on("qr", (qr) => {
    console.log(`[initializeWhatsAppClient] => Generated qr-code`);
    qrCodeWpp = qr;
  });

  whatsappClientInitialize.on("ready", () => {
    console.log(
      `\u001b[34m[initializeWhatsAppClient] => Client is READY \u001b[0m`
    );
  });

  whatsappClientInitialize.on("message", (message: Message) => {
    console.log(
      `\u001b[34m[WhatsAppClient] => \u001b[22mRecive message \u001b[0m`,
      message.id.remote
    );

    // Adiciona a nova mensagem ao buffer
    WhatsappUtil.bufferAnalyzeMessage(message);
  });

  await whatsappClientInitialize.initialize();
  return whatsappClientInitialize;
}

// Inicializa o cliente WhatsApp e guarda a promessa
whatsappClient = initializeWhatsAppClient();

export { whatsappClient, qrCodeWpp };

//========================================================================================
//================================>  Queue config  <===================================
//========================================================================================

import Queue from "bull";

const messageQueue = new Queue("messageQueue", {
  redis: {
    host: "127.0.0.1",
    port: 6379,
  },
});

//Config para bull dashboard, nao esta funcionando em prod
// import { createBullBoard } from "@bull-board/api";
// import { BullAdapter } from "@bull-board/api/bullAdapter";
// import { ExpressAdapter } from "@bull-board/express";

// messageQueue.process("Massive messages", async (job) => {
//   console.log("EXECUTANDO QUEUE massive message -> ", job.id);
// });

// // Bull-board setup
// const serverAdapter = new ExpressAdapter();
// serverAdapter.setBasePath("/admin/queues");

// const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
//   queues: [new BullAdapter(messageQueue)],
//   serverAdapter: serverAdapter,
// });

// app.use("/admin/queues", serverAdapter.getRouter());

//========================================================================================
//================================>  INITIALIZE API  <===================================
//========================================================================================

// Certificado SSL e chave privada
const sslOptions = {
  key: fs.readFileSync("/etc/letsencrypt/live/api-china.work.gd/privkey.pem"),


  cert: fs.readFileSync("/etc/letsencrypt/live/api-china.work.gd/fullchain.pem"),
};

// Inicie o servidor HTTPS
const port = process.env.PORT || 443;
const server = https.createServer(sslOptions, app);
server.listen(port, () => {
  console.log(
    `\x1b[33m[server] => HTTPS Server is running on port ${port}\x1b[0m`
  );
});

// Exports to use in other files
export { messageQueue };
