import express, { Express } from "express";
import http from "http";
import { Client, LocalAuth, Message } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import cors from "cors";
import dotenv from "dotenv";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import WhatsappUtil from "./util/whatsappUtil";

// API files
import messages from "./routes/messages";

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
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use("/messages", messages);

//========================================================================================
//================================>  Whatsapp config  <===================================
//========================================================================================

let whatsappClientInitialize: Client | null = null;
let whatsappClient: Promise<Client>;

// Função para inicializar o cliente WhatsApp
async function initializeWhatsAppClient(): Promise<Client> {
  whatsappClientInitialize = new Client({
    authStrategy: new LocalAuth({
      dataPath: "client_wpp",
    }),
    puppeteer: {
      headless: false, // Inicia o navegador em modo não-headless
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
    qrcode.generate(qr, { small: true });
    console.log(qr);
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

// Start the server
const server = http.createServer(app);
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`\x1b[33m[server] => Server is running on port ${port}\x1b[0m`);
});

// Exports to use in other files
export { whatsappClient };
