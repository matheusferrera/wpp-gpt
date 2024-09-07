import QRCode from "qrcode";
import { Request, Response } from "express";
import WppService from "../services/wpp";
import { SendMessageDto } from "../dto/message/sendMessage.dto";
import { SendMessageMassiveDto } from "../dto/message/sendMassiveMessage.dto";

const getQrCode = async (req: Request, res: Response) => {
  try {
    const qrCode = await WppService.getQrCode();
    if (qrCode == "") {
      res.send("aguarde estamos gerando o qr-Code");
    } else {
      res.setHeader("Content-Type", "image/png");
      console.log("QR CODE NO CONTROLLER => ", qrCode);
      return QRCode.toFileStream(res, qrCode as string);
    }
  } catch (e: any) {
    res.status(500).send(e.toString());
  }
};

const sendMessages = async (req: Request, res: Response) => {
  try {
    const sendMessagesDto: SendMessageDto = req.body;
    const response = await WppService.sendMessages(sendMessagesDto);
    res.send(response);
  } catch (e: any) {
    res.status(500).send(e.toString());
  }
};

const sendMessagesMassive = async (req: Request, res: Response) => {
  try {
    const SendMessageMassiveDto: SendMessageMassiveDto = req.body;
    const response = await WppService.sendMessagesMassive(
      SendMessageMassiveDto
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
