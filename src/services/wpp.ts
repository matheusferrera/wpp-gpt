import { getOrCreateWhatsAppClient } from "..";
import { messageQueue } from "..";
import { SendMessageMassiveDto } from "../dto/message/sendMassiveMessage.dto";
import { SendMessageDto } from "../dto/message/sendMessage.dto";

import { SendMessageMassiveRespDto } from "../dto/message/sendMassiveMessageResp.dto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sendMessages = async (req: SendMessageDto, clientId: string) => {
  try {
    
    const client = await getOrCreateWhatsAppClient(clientId);
    let formattedRemoteId = await client.getNumberId(req.remoteId);

    if (formattedRemoteId && formattedRemoteId._serialized) {
      let response = await client.sendMessage(formattedRemoteId._serialized, req.message);
    return response;
  }
    
  } catch (e: any) {
    console.log("ERROR -> ", e);
  }
};

const sendMessagesMassive = async (req: SendMessageMassiveDto, clientId: string) => {
  try {
    let currentTimeToSend = req.timeToSend;
    const now = Math.floor(Date.now() / 1000);  

    let response: SendMessageMassiveRespDto = {
      content: req.message,
      messages: [],
    };

    //Verificando se o tempo para envio é válido
    if (currentTimeToSend < now) {
      const respErro = `Por favor insira uma data futura`;

      return { Error: respErro };
    }

    //Gerando um horario aleatorio para cada remoteId
    for (const remoteId of req.remoteId) {

      const randomOffset = Math.floor(Math.random() * 20);

      currentTimeToSend += randomOffset;

      //Enviando req para a fila
      const delay = (currentTimeToSend - now) * 1000;

      console.log("DELAY DA MSG em s -> ", delay/1000);
      messageQueue.add(
        "Massive messages",
        {
          content: req.message,
          to: remoteId,
          clientId: clientId, // Add clientId to the job data
        },
        { delay }
      );

      response.messages.push({
        to: remoteId,
        timeToSend: currentTimeToSend
      });
    }

    return response;
  } catch (error) {
    console.error("Erro ao criar mensagem:", error);
  }
};

const WppService = {
  sendMessages,
  sendMessagesMassive,
  // Remove getQrCode from here as it's no longer needed in this service
};

export default WppService;
