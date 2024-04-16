import UserModel from "../models/User";
import ChatModel from "../models/Chat";
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

const createMessages = async (clientId: string, userId: string, message: string, mimeType?: string, media?: string, isAutomatic?: boolean) => {
    try {
        let response;
        if(isAutomatic) {
            const whatsapp = whatsappClients.get(clientId);
            response = await whatsapp.sendMessage(userId, message);
            const newMessageId = response.id.id;
            const filter = { clientId: clientId, remoteId: userId, 'messages.id.id': newMessageId };
            const update = { $set: { 'messages.$.isAutomatic': true } }; 
            const options = { upsert: false, new: true };

            setTimeout(async () => {
                try {
                    response = await ChatModel.findOneAndUpdate(filter, update, options);
                } catch (error: any) {
                    console.error("ERROR -> ", error);
                }
            }, 2000);
        }
        else if(mimeType && media) {
            const messageMedia = new MessageMedia(mimeType, media);
            const whatsapp = whatsappClients.get(clientId);
            response = await whatsapp.sendMessage(userId, messageMedia);
        }
        else {
            const whatsapp = whatsappClients.get(clientId);
            response = await whatsapp.sendMessage(userId, message);
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