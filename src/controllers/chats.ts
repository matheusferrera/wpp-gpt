import {Request, Response } from "express";
import ChatService from "../services/chats";

const getChats = async(req: Request, res: Response) => {
    try {
        const clientId = req.params.clientId;
        const limit = parseInt(req.query.limit as string) ;
        const page = parseInt(req.query.page as string) ;
        const response = await ChatService.getChats(clientId, limit, page);
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}

const getMessagesChats = async(req: Request, res: Response) => {
    try {
        const clientId = req.params.clientId;
        const wppNumber = req.params.wppNumber;
        const limit = parseInt(req.query.limit as string) ;
        const page = parseInt(req.query.page as string) ;
        const response = await ChatService.getMessagesChats(clientId, wppNumber, limit, page);
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}

const createChats = async(req: Request, res: Response) => {
    try {
        const clientId = req.body.clientId;
        const remoteId = req.body.remoteId;
        const message = req.body.message;
        const mimeType = req.body.mimeType;
        const media = req.body.media;
        const response = await ChatService.createChats(clientId, remoteId, message, mimeType, media);
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}


const MessageController = {
    getChats,
    getMessagesChats,
    createChats,
}

export default MessageController