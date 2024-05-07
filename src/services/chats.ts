import ChatsModel from "../models/Chat";
import { MessageMedia } from "whatsapp-web.js";
import { whatsappClients } from "..";

const getChats = async (clientId: string, limit: number, page: number) => {
    try {
        let response;
        const whatsapp = whatsappClients.get(clientId);
        
        if(whatsapp == undefined){
            return {error: "whatsapp client doesnt exist or not ready"}
        }
        
        response = await whatsapp.getChats()

        response = response.map(({ id, name, timestamp, unreadCount, lastMessage }: any) => ({
            id,
            name,
            timestamp,
            unreadCount,
            lastMessage: lastMessage ? {body: lastMessage._data.body, type: lastMessage._data.type, author: lastMessage._data.author} : '', // Verifica se lastMessage existe antes de acessar _data.body
          }));
        
        const init = page * limit
        const final = init + limit
        response = response.slice(init, final)
            
        return response;
   
    } catch (e: any) {
        console.log("ERROR -> ", e);
        throw e.message
    }
}

const getMessagesChats = async (clientId: string, wppNumber:string, limit: number, page: number) => {
    try {
        let response;

        const whatsapp = whatsappClients.get(clientId);
        if(whatsapp == undefined){
            return {"error": "client is not exist or not activate"}
        }

        let formatedNumber = await whatsapp.getNumberId(wppNumber)
        if(formatedNumber == undefined){
            return {"error": "number is not registered on whatsapp"}
        }
        formatedNumber = formatedNumber._serialized
        await whatsapp.interface.openChatWindow(formatedNumber)
        const chatInstance = await whatsapp.getChatById(formatedNumber)
        
        //set a lot messages and returns oldest messages first
        const messages = await chatInstance.fetchMessages({limit: 9999999})
        const init = page * limit
        const final = init + limit

        console.log("INIT -> ", init, "final -> ", final, " tam ->", messages.length)
            
        let responseFormated = messages.reverse().slice(init, final).map((respMessage: any) => ({
            body: respMessage.body,
            type: respMessage.type,
            timestamp: respMessage.timestamp,
            to: respMessage.to,
            from: respMessage.from,
        }));

        
        response = responseFormated
            
        return response;
   
    } catch (e: any) {
        console.log("ERROR -> ", e);
        throw e.message
    }
}


const createChats = async (clientId: string, remoteId: string, message: string, mimeType?: string, media?: string) => {
    try {
        let response;

        const whatsapp = whatsappClients.get(clientId);
        if(whatsapp == undefined){
            return {"error": "client is not exist or not activate"}
        }

        let formatedNumber = await whatsapp.getNumberId(remoteId)
        if(formatedNumber == undefined){
            return {"error": "number is not registered on whatsapp"}
        }
        formatedNumber = formatedNumber._serialized

        if(mimeType && media) {
            const messageMedia = new MessageMedia(mimeType, media);
            const respMessage = await whatsapp.sendMessage(formatedNumber, messageMedia, {"sendAudioAsVoice": true, "caption": message});
            let responseFormated = {
                body: respMessage.body,
                type: respMessage.type,
                timestamp: respMessage.timestamp,
                to: respMessage.to,
            }
            response = responseFormated;
        }
        else {
         
            const respMessage = await whatsapp.sendMessage(formatedNumber, message);
            let responseFormated = {
                body: respMessage.body,
                type: respMessage.type,
                timestamp: respMessage.timestamp,
                to: respMessage.to,
            }
            response = responseFormated;
        }

        return response;
   
    } catch (e: any) {
        console.log("ERROR -> ", e);
        throw e.message
    }
}


const ChatService = {
    getChats,
    getMessagesChats,
    createChats
}


export default ChatService;