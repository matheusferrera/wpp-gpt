import GroupModel from "../models/Group";
import { GroupChat } from "whatsapp-web.js";
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

        const groupId = response.gid._serialized;
        const groupObj = await whatsapp.getChatById(groupId);
        response = groupObj as GroupChat;

        return response;
   
    } catch (e: any) {
        console.log("ERROR -> ", e);
    }
}

const deleteGroups = async (clientId: string, remoteId: string) => {
    try {
        let response;
        if(clientId && remoteId){
            const whatsapp = whatsappClients.get(clientId);
            const groupObj = await whatsapp.getChatById(remoteId);
            const group = groupObj as GroupChat;
            response = await group.leave();
            response = await group.delete();
            // response = await GroupModel.updateMany({ clientId: clientId, remoteId: remoteId }, { messages: [] });
        } else {
            response = await GroupModel.find();
        }
        
        return response;
   
    } catch (e: any) {
        console.log("ERROR -> ", e);
    }
}

const GroupService = {
    getGroups,
    createGroups,
    deleteGroups
}

export default GroupService;