import QRCode from "qrcode";
import { Request, Response } from "express";
import WppService from "../services/wpp";
import { SendMessageDto } from "../dto/message/sendMessage.dto";
import { SendMessageMassiveDto } from "../dto/message/sendMassiveMessage.dto";
import { getOrCreateWhatsAppClient, getQRCode } from "../index";
import { AuthRequest } from "../auth.middleware";

const getQrCode = async (req: AuthRequest, res: Response) => {
  try {
    const clientId = req.clientsIds?.[0];
    if (!clientId) {
      return res.status(400).json({ error: 'No client ID provided' });
    }
    
    // Tenta obter o QR code existente
    let qrCode = getQRCode(clientId);
    
    // Se não houver QR code, inicializa um novo cliente
    if (!qrCode) {
      console.log(`Inicializando novo cliente para clientId: ${clientId}`);
      await getOrCreateWhatsAppClient(clientId);
      
      // Aguarda um curto período para dar tempo ao cliente de gerar o QR code
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Tenta obter o QR code novamente
      qrCode = getQRCode(clientId);
    }

    if (!qrCode) {
      res.send("Aguarde, estamos gerando o QR Code. Por favor, tente novamente em alguns segundos.");
    } else {
      res.setHeader("Content-Type", "image/png");
      console.log("QR CODE NO CONTROLLER => ", qrCode);
      return QRCode.toFileStream(res, qrCode);
    }
  } catch (e: any) {
    console.error("Erro ao gerar QR Code:", e);
    res.status(500).send(e.toString());
  }
};

const sendMessages = async (req: AuthRequest, res: Response) => {
  const clientId = req.clientsIds?.[0];
  if (!clientId) {
    return res.status(400).json({ error: 'No client ID provided' });
  }
  try {
    const sendMessagesDto: SendMessageDto = req.body;
    const response = await WppService.sendMessages(sendMessagesDto, clientId);
    res.send(response);
  } catch (e: any) {
    res.status(500).send(e.toString());
  }
};

const sendMessagesMassive = async (req: AuthRequest, res: Response) => {
  const clientId = req.clientsIds?.[0];
  if (!clientId) {
    return res.status(400).json({ error: 'No client ID provided' });
  }
  try {
    const SendMessageMassiveDto: SendMessageMassiveDto = req.body;
    const response = await WppService.sendMessagesMassive(
      SendMessageMassiveDto,
      clientId
    );
    res.send(response);
  } catch (e: any) {
    res.status(500).send(e.toString());
  }
};

const WppController = {
  getQrCode,
  sendMessages,
  sendMessagesMassive,
};

export default WppController;
