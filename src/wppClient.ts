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
      // executablePath: "/usr/bin/chromium-browser",
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
    qrcode.generate(qr, { small: true });
    qrCodeWpp = qr;
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

export { whatsappClient, qrCodeWpp };
