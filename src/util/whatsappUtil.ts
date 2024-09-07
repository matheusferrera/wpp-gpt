import { Message } from "whatsapp-web.js";
import { whatsappClient } from "../wppClient";
import gpt from "../gpt";

const formatNumber = async (remoteId: string) => {
  try {
    let response = await (await whatsappClient).getNumberId(remoteId);
    return response?._serialized;
  } catch (e: any) {
    console.log("ERROR -> ", e);
  }
};

const isContact = async (remoteId: string) => {
  try {
    let response = await (await whatsappClient).getContactById(remoteId);
    return response;
  } catch (e: any) {
    console.log("ERROR -> ", e);
  }
};

const typingAndSendMessage = async (remoteId: string, messageContent: any) => {
  const chatInstace = (await whatsappClient).getChatById(remoteId);
  console.log(
    "COMECOU A DIGITAR! no remote id - ",
    remoteId,
    " -- ",
    await chatInstace
  );
  await (await chatInstace).sendStateTyping();
  //State typing dura 25 segundos, então espera o tempo antes de enviar
  setTimeout(async () => {
    console.log(
      `\u001b[35m[WhatsappUtil / \u001b[32mtypingAndSendMessage\u001b[35m] => Terminou o estado de digitar e irá enviar a mensagem para o - remoteId: \u001b[0m`,
      remoteId,
      " - Mensagem: ",
      messageContent
    );

    await (await chatInstace).sendMessage(messageContent);
  }, 25000);
};

const analyzeMessage = async (messages: Message[]) => {
  // Agrupa mensagens por remoteId
  const groupedMessagesByRemoteId = messages.reduce((acc, message) => {
    const remoteId = message.id.remote;
    if (!acc[remoteId]) {
      acc[remoteId] = [];
    }
    acc[remoteId].push(message);
    return acc;
  }, {} as Record<string, Message[]>);

  for (const [remoteId, messageArray] of Object.entries(
    groupedMessagesByRemoteId
  )) {
    let contactName;
    let filteredContentMessageArray;

    //==========================================================
    //  Extraindo informações básicas da mensagem (nome do autor, conteudo e etc)
    //==========================================================

    //Verifica se as mensagens foram enviados por um usuario
    if (remoteId.endsWith("@c.us")) {
      const contactInfo = await isContact(remoteId);

      contactName =
        contactInfo?.name != undefined
          ? contactInfo?.name
          : contactInfo?.pushname;
    }

    //Extraindo as ultimas mensagens
    filteredContentMessageArray = messageArray.map((message) => message.body);

    console.log(
      `\u001b[35m[WhatsappUtil / AnalyzeMessage] => Analisando as mensagens do remoteId - id: \u001b[0m`,
      remoteId,
      "  - Mensagens: ",
      filteredContentMessageArray
    );

    //==========================================================
    //  Verificando se necessita de alguma ação para o usuário
    //==========================================================

    if (remoteId == "556192045128@c.us" || remoteId == "556182239531@c.us") {
      const respGpt = await gpt.sendRequest(
        filteredContentMessageArray,
        contactName as string
      );

      await typingAndSendMessage(remoteId, respGpt.message.content);
    }
  }
};

let messageBuffer: Message[] = [];
let timer: NodeJS.Timeout | null = null;

const bufferAnalyzeMessage = (message: Message) => {
  messageBuffer.push(message);
  if (!timer) {
    timer = setTimeout(async () => {
      console.log(
        `\u001b[35m[WhatsappUtil / BufferAnalyzeMessages] => Buffer enviando requisição de analyzeMessage - Tamanho: \u001b[0m`,
        messageBuffer.length
      );

      await analyzeMessage(messageBuffer);
      messageBuffer = []; // Limpa o buffer após a análise
      timer = null; // Reseta o temporizador
    }, 60000); // 60 segundos
  }
};

const WhatsappUtil = {
  formatNumber,
  analyzeMessage,
  bufferAnalyzeMessage,
  isContact,
  typingAndSendMessage,
};

export default WhatsappUtil;
