import { Request, Response } from "express";
import MessageService from "../services/messages";
import { SendMessageDto } from "../dto/message/sendMessage.dto";
import { SendMessageMassiveDto } from "../dto/message/sendMassiveMessage.dto";

const getMessages = async (req: Request, res: Response) => {
  try {
    const response = await MessageService.getMessages(
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
    const response = await MessageService.sendMessages(sendMessagesDto);
    res.send(response);
  } catch (e: any) {
    res.status(500).send(e.toString());
  }
};

const sendMessagesMassive = async (req: Request, res: Response) => {
  try {
    const SendMessageMassiveDto: SendMessageMassiveDto = req.body;
    const response = await MessageService.sendMessagesMassive(
      SendMessageMassiveDto
    );
    res.send(response);
  } catch (e: any) {
    res.status(500).send(e.toString());
  }
};

const MessageController = {
  getMessages,
  sendMessages,
  sendMessagesMassive,
};

export default MessageController;
