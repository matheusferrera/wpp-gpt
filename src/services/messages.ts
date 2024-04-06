import UserModel from "../models/User";
import { MessageMedia } from "whatsapp-web.js";
import { whatsappClients } from "..";

const getMessages = async (clientId: string, userId: string) => {
    try {
        let response;
        if(clientId && userId){
            response = await UserModel.find({ clientId: clientId, userId: userId });
        } else if(clientId){
            response = await UserModel.find({ clientId: clientId });
        } else {
            response = await UserModel.find();
        }
        
        return response;
   
    } catch (e: any) {
        console.log("ERROR -> ", e);
    }
}

const createMessages = async (clientId: string, userId: string, message: string, mimeType?: string, media?: string) => {
    try {
        let response;
        if(mimeType && media) {
            const messageMedia = new MessageMedia(mimeType, media);
            const whatsapp = whatsappClients.get(clientId);
            await whatsapp.sendMessage(userId, messageMedia);
            response = {"detail": "message sent"};
        }
        else {
            const whatsapp = whatsappClients.get(clientId);
            await whatsapp.sendMessage(userId, message);
            response = {"detail": "message sent"};
        }

        return response;
   
    } catch (e: any) {
        console.log("ERROR -> ", e);
    }
}

const deleteMessages = async (clientId: string, userId: string) => {
    try {
        let response;
        if(clientId && userId){
            response = await UserModel.updateMany({ clientId: clientId, userId: userId }, { messages: [] });
        } else if(clientId){
            response = await UserModel.updateMany({ clientId: clientId }, { messages: [] });
        } else {
            response = await UserModel.find();
        }
        
        return response;
   
    } catch (e: any) {
        console.log("ERROR -> ", e);
    }
}

const ClientService = {
    getMessages,
    deleteMessages,
    createMessages
}

export default ClientService;