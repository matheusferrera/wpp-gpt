
import UserModel from "../models/User";

const getMessages = async (clientId: string, userId: string) => {
    try {
        let response
        if(clientId && userId){
            response = await UserModel.find({ clientId: clientId, userId: userId });
        } else if(clientId){
            response = await UserModel.find({ clientId: clientId });
        } else {
            response = await UserModel.find();
        }
        
        return response
   
    } catch (e: any) {
        console.log("ERROR -> ", e)
    }
}


const deleteMessages = async (clientId: string, userId: string) => {
    try {
        let response
        if(clientId && userId){
            response = await UserModel.updateMany({ clientId: clientId, userId: userId }, { messages: [] });
        } else if(clientId){
            response = await UserModel.updateMany({ clientId: clientId }, { messages: [] });
        } else {
            response = await UserModel.find();
        }
        
        return response
   
    } catch (e: any) {
        console.log("ERROR -> ", e)
    }
}

const ClientService = {
    getMessages,
    deleteMessages
}

export default ClientService;