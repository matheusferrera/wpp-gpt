import QRCode from "qrcode";
import { whatsappClient, qrCodeWpp } from "../wppClient";
import { messageQueue } from "..";
import { SendMessageMassiveDto } from "../dto/message/sendMassiveMessage.dto";
import { SendMessageDto } from "../dto/message/sendMessage.dto";
import WhatsappUtil from "../util/whatsappUtil";
import { SendMessageMassiveRespDto } from "../dto/message/sendMassiveMessageResp.dto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getQrCode = async () => {
  try {
    return qrCodeWpp;
  } catch (e: any) {
    console.log("ERROR -> ", e);
  }
};

const sendMessages = async (req: SendMessageDto) => {
  try {
    let formatedRemoteId: string =
      (await WhatsappUtil.formatNumber(req.remoteId)) ?? "";

    let response = (await whatsappClient).sendMessage(
      formatedRemoteId,
      req.message
    );

    return response;
  } catch (e: any) {
    console.log("ERROR -> ", e);
  }
};

const sendMessagesMassive = async (req: SendMessageMassiveDto) => {
  try {
    let currentTimeToSend = req.timeToSend;
    const now = Math.floor(Date.now() / 1000);

    const date = new Date(currentTimeToSend * 1000);
    const dateNow = new Date(now * 1000);
    const formatDateInBrazil = date.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });
    const formatDateNow = dateNow.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });

    console.log("DATA INFORMADA -> ", formatDateInBrazil);
    console.log("NOW  -> ", formatDateNow);

    console.log("DATA INFORMADA  [UNIX TIME] -> ", currentTimeToSend);
    console.log("NOW  [UNIX TIME] -> ", now);

    let response: SendMessageMassiveRespDto = {
      content: req.message,
      messages: [],
    };

    //Verificando se o tempo para envio é válido
    if (currentTimeToSend < now) {
      const respErro = `Data informada (${formatDateInBrazil}) é menor que a data atual, por favor insira uma data futura`;

      return { Error: respErro };
    }

    //Gerando um horario aleatorio para cada remoteId
    for (const remoteId of req.remoteId) {
      const randomOffset = Math.floor(Math.random() * 10);

      currentTimeToSend += randomOffset;

      //Enviando req para DB um horario aleatorio para cada remoteId
      const newMessage = await prisma.message.create({
        data: {
          to: remoteId,
          content: req.message,
          timeToSend: currentTimeToSend,
        },
      });

      //Enviando req para a fila
      const delay = (currentTimeToSend - now) * 1000;

      console.log("DELAY DA MSG -> ", delay);
      messageQueue.add(
        "Massive messages",
        {
          content: req.message,
          to: newMessage.to,
        },
        { delay }
      );

      response.messages.push({
        to: newMessage.to,
        timeToSend: newMessage.timeToSend,
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
  getQrCode,
};

export default WppService;
