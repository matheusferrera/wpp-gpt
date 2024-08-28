import { whatsappClient } from "..";
import { SendMessageDto } from "../dto/message/sendMessage.dto";
import WhatsappUtil from "../util/whatsappUtil";

const getMessages = async (remoteId: string, limit: number) => {
  try {
    let formatedRemoteId: string =
      (await WhatsappUtil.formatNumber(remoteId)) ?? "";

    const chatInstance = (await whatsappClient).getChatById(formatedRemoteId);

    const messages = (await chatInstance).fetchMessages({ limit: limit });

    console.log("MESSAGES -> ", messages);

    return messages;
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

const MessageService = {
  getMessages,
  sendMessages,
};

export default MessageService;
