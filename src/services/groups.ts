import GroupModel from "../models/Group";
import { GroupChat, Label } from "whatsapp-web.js";
import { whatsappClients } from "..";

const getGroups = async (clientId: string, remoteId: string) => {
    try {
        let response;
        if(clientId && remoteId) {
            // response = await GroupModel.find({ clientId: clientId, remoteId: remoteId });
            const whatsapp = whatsappClients.get(clientId);
            const groupObj = await whatsapp.getChatById(remoteId);
            response = groupObj as GroupChat;
        } else if(clientId) {
            // response = await GroupModel.find({ clientId: clientId });
            const whatsapp = whatsappClients.get(clientId);
            const chats = await whatsapp.getChats();
            const chatObjects = chats.filter((chat: any) => chat.isGroup);
            const groupChats = chatObjects.map((groupChat: any) => {
                const groupChatObj = groupChat as GroupChat;
                return groupChatObj;
            });
            response = groupChats;
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

const getLabels = async (clientId: string, remoteId: string) => {
    try {
        let response;
        // const whatsapp = whatsappClients.get(clientId);
        // const groupObj = await whatsapp.getChatById(remoteId);
        // const group = groupObj as GroupChat;
        // response = await group.getLabels();
        response = await GroupModel.find({ clientId: clientId, remoteId: remoteId });

        return response;
   
    } catch (e: any) {
        console.log("ERROR -> ", e);
    }
}

const addLabels = async (clientId: string, remoteId: string, label: string) => {
    try {
        let response;
        // const whatsapp = whatsappClients.get(clientId);
        // const groupObj = await whatsapp.getChatById(remoteId);
        // const group = groupObj as GroupChat;
        response = await GroupModel.findOneAndUpdate(
            { clientId: clientId, remoteId: remoteId }, 
            { $push: { labels: label } },
            { upsert: true, new: true }
        );

        return response;
   
    } catch (e: any) {
        console.log("ERROR -> ", e);
    }
}

const deleteLabels = async (clientId: string, remoteId: string, label: string) => {
    try {
        let response;
        // const whatsapp = whatsappClients.get(clientId);
        // const groupObj = await whatsapp.getChatById(remoteId);
        // const group = groupObj as GroupChat;
        // response = await group.changeLabels([labelId]);
        response = await GroupModel.deleteOne(
            { clientId: clientId, remoteId: remoteId },
            { $pull: { labels: label } },
        );

        return response;
   
    } catch (e: any) {
        console.log("ERROR -> ", e);
    }
}

const updateGroups = async (clientId: string, remoteId: string, subject: string) => {
    try {
        let response;
        if(clientId && remoteId){
            const whatsapp = whatsappClients.get(clientId);
            const groupObj = await whatsapp.getChatById(remoteId);
            const group = groupObj as GroupChat;
            response = await group.setSubject(subject);
            // response = await GroupModel.updateMany({ clientId: clientId, remoteId: remoteId }, { messages: [] });
        } else {
            response = await GroupModel.find();
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
    getLabels,
    addLabels,
    deleteLabels,
    updateGroups,
    deleteGroups
}

export default GroupService;
