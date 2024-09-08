import { whatsappClient } from "..";
import WhatsappUtil from "../util/whatsappUtil";

const boasVindas = async (remoteId: string) => {
  console.log("[WhatsAppClient] => Send template boas-vindas  ", remoteId);

  try {
    let formatedRemoteId: string =
      (await WhatsappUtil.formatNumber(remoteId)) ?? "";

    let response = (await whatsappClient).sendMessage(
      formatedRemoteId,
      "Olá seja bem vindo a consultoria do china"
    );
    return response;
  } catch (e: any) {
    console.log("ERROR -> ", e);
    throw e; // Re-lançando o erro para tratamento posterior, se necessário
  }
};

const MessageService = {
  boasVindas,
};

export default MessageService;
