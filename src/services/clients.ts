import ClientModel from "../models/Client";


const getClients = async (clientId: string) => {
    try {
        let response;
        if(clientId){
            response = await ClientModel.find({ clientId: clientId });
        } else{
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
    deleteClients
}

export default MessageService; 