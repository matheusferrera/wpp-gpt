import ClientModel from "../models/Client";
import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const getClients = async (clientId: string) => {
    try {
        let response;
        if (clientId) {
            response = await ClientModel.find({ clientId: clientId });
        } else {
            response = await ClientModel.find();
        }

        return response;

    } catch (e: any) {
        console.log("ERROR -> ", e);
    }
}

const changeClients = async (clientId: string) => {
    try {
        const response = await ClientModel.findOneAndUpdate({ clientId: clientId }, { upsert: true, new: true });
        return response;

    } catch (e: any) {
        console.log("ERROR -> ", e)
    }
}


const activeClients = async (clientId: string) => {
    try {

        const clientExist = await getClients(clientId) || []

        if(clientExist.length === 0 ){
            console.log(`[activeClient] => Client ${clientId} doesnt exist`)
            return {"Error": "Client doesnt exist"}
        }

        console.log(`[activeClient] => Activating client - ${clientId}`)
        const whatsappClient = new Client({
            authStrategy: new LocalAuth({
                dataPath: clientId
            })
        });


        whatsappClient.on("loading_screen", (percent, message) => {
            console.log(`[activeClient] => Loading whatsapp connection.... ${clientId} // ${message}`)
          });
        
        let response

        whatsappClient.on("qr", (qr) => {
            qrcode.generate(qr, { small: true });
            console.log(`[activeClient] => Generated qr-code - ${clientId}`)
            response = {"QRcode": qr}
            return 
        });
          
        whatsappClient.on("auth_failure", (message) => {
            console.log(`[activeClient] => Auth failure - ${clientId} // ${message}`)
            response = {"Error": "Auth failure"}
            return 
        }); 

        whatsappClient.on("ready", () => {
            console.log(`[activeClient] => Client is ready - ${clientId} `)
            response = {"Success": "Client is ready"} 
            return 
          });

        await whatsappClient.initialize();

        return response

    } catch (e: any) {
        console.log("ERROR -> ", e)
    }
}


const deleteClients = async (clientId: string) => {
    try {
        const response = await ClientModel.deleteOne({ clientId: clientId });
        return response;

    } catch (e: any) {
        console.log("ERROR -> ", e);
    }
}

const MessageService = {
    getClients,
    changeClients,
    deleteClients,
    activeClients
}

export default MessageService; 