import GroupModel from "../models/Group";
import { MessageMedia } from "whatsapp-web.js";
import { whatsappClients } from "..";

const getGroups = async (clientId: string, remoteId: string) => {
    try {
        let response;
        if(clientId && remoteId){
            response = await GroupModel.find({ clientId: clientId, remoteId: remoteId });
        } else if(clientId){
            response = await GroupModel.find({ clientId: clientId });
        } else {
            response = await GroupModel.find();
        }
        
        return response;
   
    } catch (e: any) {
        console.log("ERROR -> ", e);
    }
}

const createGroups = async (clientId: string, remoteId: string, message: string, mimeType?: string, media?: string) => {
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

const deleteGroups = async (clientId: string, remoteId: string) => {
    try {
        let response;
        if(clientId && remoteId){
            response = await GroupModel.updateMany({ clientId: clientId, remoteId: remoteId }, { messages: [] });
        } else if(clientId){
            response = await GroupModel.updateMany({ clientId: clientId }, { messages: [] });
        } else {
            response = await GroupModel.find();
        }
        
        return response;
   
    } catch (e: any) {
        console.log("ERROR -> ", e);
    }
}

const ChatService = {
    getGroups,
    createGroups,
    deleteGroups
}

export default ChatService;