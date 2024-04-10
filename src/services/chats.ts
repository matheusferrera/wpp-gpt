import ChatsModel from "../models/Chat";
import { MessageMedia } from "whatsapp-web.js";
import { whatsappClients } from "..";

const getChats = async (clientId: string, remoteId: string) => {
    try {
        let response;
        if(clientId && remoteId){
            response = await ChatsModel.find({ clientId: clientId, remoteId: remoteId });
        } else if(clientId){
            response = await ChatsModel.find({ clientId: clientId });
        } else {
            response = await ChatsModel.find();
        }
        
        return response;
   
    } catch (e: any) {
        console.log("ERROR -> ", e);
    }
}

const createChats = async (clientId: string, remoteId: string, message: string, mimeType?: string, media?: string) => {
    try {
        let response;
        if(mimeType && media) {
            const messageMedia = new MessageMedia(mimeType, media);
            const whatsapp = whatsappClients.get(clientId);
            await whatsapp.sendMessage(remoteId, messageMedia);
            response = {"detail": "message sent"};
        }
        else {
            const whatsapp = whatsappClients.get(clientId);
            await whatsapp.sendMessage(remoteId, message);
            response = {"detail": "message sent"};
        }

        return response;
   
    } catch (e: any) {
        console.log("ERROR -> ", e);
    }
}

const deleteChats = async (clientId: string, remoteId: string) => {
    try {
        let response;
        if(clientId && remoteId){
            response = await ChatsModel.updateMany({ clientId: clientId, remoteId: remoteId }, { messages: [] });
        } else if(clientId){
            response = await ChatsModel.updateMany({ clientId: clientId }, { messages: [] });
        } else {
            response = await ChatsModel.find();
        }
        
        return response;
   
    } catch (e: any) {
        console.log("ERROR -> ", e);
    }
}

const ChatService = {
    getChats,
    createChats,
    deleteChats
}

export default ChatService;