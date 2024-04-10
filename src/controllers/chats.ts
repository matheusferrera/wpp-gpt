import {Request, Response } from "express";
import ChatService from "../services/chats";

const getChats = async(req: Request, res: Response) => {
    try {
        const clientId = req.params.clientId;
        const remoteId = req.params.remoteId;
        const response = await ChatService.getChats(clientId, remoteId);
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

const deleteChats = async(req: Request, res: Response) => {
    try {
        const clientId = req.params.clientId;
        const remoteId = req.params.remoteId;
        console.log("DETE -> ", clientId);
        const response = await ChatService.deleteChats(clientId, remoteId);
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}

const MessageController = {
    getChats,
    createChats,
    deleteChats
}

export default MessageController