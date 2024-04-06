import {Request, Response } from "express";
import MessageService from "../services/messages";

const getMessages = async(req: Request, res: Response) => {
    try {
        const clientId = req.params.clientId;
        const userId = req.params.userId;
        const response = await MessageService.getMessages(clientId, userId);
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}

const createMessages = async(req: Request, res: Response) => {
    try {
        const clientId = req.body.clientId;
        const userId = req.body.userId;
        const message = req.body.message;
        const media = req.body.media;
        const response = await MessageService.createMessages(clientId, userId, message, media);
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}

const deleteMessages = async(req: Request, res: Response) => {
    try {
        const clientId = req.params.clientId;
        const userId = req.params.userId;
        console.log("DETE -> ", clientId);
        const response = await MessageService.deleteMessages(clientId, userId);
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}

const MessageController = {
    getMessages,
    createMessages,
    deleteMessages
}

export default MessageController