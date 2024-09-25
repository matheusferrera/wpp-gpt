import axios from "axios";
import { whatsappClient } from "..";
import WhatsappUtil from "../util/whatsappUtil";
import GoogleService from "./google";

const boasVindas = async (remoteId: string, ip: string) => {
  console.log("[WhatsAppClient] => Send template boas-vindas  ", remoteId);

  try {
    let formatedRemoteId: string =
      (await WhatsappUtil.formatNumber(remoteId)) ?? "";

    let responseWpp = (await whatsappClient).sendMessage(
      formatedRemoteId,
      "Olá seja bem vindo a consultoria do china"
    );

    const ipLoc = await getLocationFromIP(ip);
    console.log("LOCATION -> ", ipLoc);

    GoogleService.addRow([
      [
        formatedRemoteId,
        "boas vindas",
        DateTimeNow(),
        ipLoc.city + " / " + ipLoc.region,
      ],
    ]);

    const response = {
      telefone: formatedRemoteId,
      template: "boas vindas",
      data: DateTimeNow(),
      loc: ipLoc.city + " / " + ipLoc.region,
    };

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

const getLocationFromIP = async (ip: string) => {
  try {
    // Usando o endpoint gratuito do ip-api
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching IP location:", error);
    throw error;
  }
};

const DateTimeNow = () => {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Janeiro é 0
  const year = String(now.getFullYear()).slice(2); // Últimos dois dígitos do ano

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
