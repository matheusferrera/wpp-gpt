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

const createGroups = async (clientId: string, title: string, participants: Array<string>) => {
    try {
        let response;
        const whatsapp = whatsappClients.get(clientId);
        response = await whatsapp.createGroup(title, participants);
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