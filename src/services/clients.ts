import ClientModel, { IClient } from "../models/Client";
import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";


const getClients = async (clientId: string) => {
    try {
        let response;
        if (clientId) {
            response = await ClientModel.find({ _id: clientId });
        } else {
            response = await ClientModel.find();
        }

        return response;

    } catch (e: any) {
        console.log("[getClient ERROR] =>  ", e);
        throw e
    }
}

const createClient = async (reqBody: IClient) => {
    try {
        const newClient = new ClientModel(reqBody);
        const savedClient = await newClient.save();
        return savedClient;
    } catch (e: any) {
        console.log("[createClient ERROR] =>  ", e);
        throw e
    }
}

const changeClients = async (clientId: string) => {
    try {
        const response = await ClientModel.findOneAndUpdate({ clientId: clientId }, { upsert: true, new: true });
        return response;

    } catch (e: any) {
        console.log("[changeClient ERROR] =>  ", e);
        throw e
    }
}




const activeClients = (clientId: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const clientExist = await getClients(clientId) || [];

            if (clientExist.length === 0) {
                console.log(`[activeClient] => Client ${clientId} doesn't exist`);
                resolve({"Error": "Client doesn't exist"});
            }

            console.log(`[activeClient] => Activating client - ${clientId}`);
            const whatsappClient = new Client({
                authStrategy: new LocalAuth({
                    dataPath: "client_"+clientId,
                }),
            });

            whatsappClient.on("loading_screen", (percent, message) => {
                console.log(`[activeClient] => Loading whatsapp connection.... ${clientId} // ${message}`);
            });

            whatsappClient.on("qr", (qr) => {
                qrcode.generate(qr, { small: true });
                console.log(`[activeClient] => Generated qr-code - ${clientId}`);
                resolve({"QRcode": qr});
            });

            whatsappClient.on("auth_failure", (message) => {
                console.log(`[activeClient] => Auth failure - ${clientId} // ${message}`);
                resolve({"Error": "Auth failure"});
            });

            whatsappClient.on("ready", () => {
                console.log(`[activeClient] => Client is ready - ${clientId}`);
                resolve({"Success": "Client is ready"});
            });

            await whatsappClient.initialize();
        } catch (error) {
            console.log("ERROR -> ", error);
            reject(error);
        }
    });
};


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
    createClient,
    changeClients,
    deleteClients,
    activeClients
}

export default MessageService; 