import { Request, Response } from "express";
import MessageService from "../services/messages";
import { PaginationDto } from "../dto/query/pagination.dto";
import { plainToInstance } from "class-transformer";
import { PatchMessageDto } from "../dto/message/PatchMessage.dto";

const getMessages = async (req: Request, res: Response) => {
  try {
    const dtoInstance = plainToInstance(PaginationDto, req.query as object);
    const response = await MessageService.getMessages(dtoInstance);
    res.send(response);
  } catch (e: any) {
    res.status(500).send(e.toString());
  }
};

const patchMessages = async (req: Request, res: Response) => {
  try {
    const dtoInstance = plainToInstance(PatchMessageDto, req.body as object);
    const response = await MessageService.patchMessages(dtoInstance);
    res.send(response);
  } catch (e: any) {
    console.log("ERRO NO PATCH !!!! -> ", e.meta.cause);
    res.status(500).send(e.meta.cause);
  }
};

const MessageController = {
  getMessages,
  patchMessages,
};

export default MessageController;
