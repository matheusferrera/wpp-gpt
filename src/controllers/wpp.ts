import { Request, Response } from "express";
import WppService from "../services/wpp";
import { SendMessageDto } from "../dto/message/sendMessage.dto";
import { SendMessageMassiveDto } from "../dto/message/sendMassiveMessage.dto";

const getMessages = async (req: Request, res: Response) => {
  try {
    const response = await WppService.getMessages(
      req.params.clientId,
      +req.params.limit
    );
    res.send(response);
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
  getMessages,
  sendMessages,
  sendMessagesMassive,
};

export default WppController;
