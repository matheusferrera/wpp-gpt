import ContactModel, { IContact } from "../models/Contact";
import UserModel, { IUser } from "../models/User"
import { whatsappClients } from "..";

const getContacts = async (ContactId: string) => {
    try {
        let response;
        if (ContactId) {
            response = await ContactModel.find({ _id: ContactId });
        } else {
            response = await ContactModel.find();
        }

        return response;

    } catch (e: any) {
        console.log("[getContact ERROR] =>  ", e);
        throw e;
    }
}

const createContact = async (reqBody: IContact) => {
    try {
        // const whatsapp = whatsappClients.get(clientId);
        // const wppNumber = await whatsapp.getNumberId(reqBody.wppNumber);
        
        const newContact = new ContactModel(reqBody);
        const savedContact = await newContact.save();
        return savedContact;
    } catch (e: any) {
        console.log("[createContact ERROR] =>  ", e);
        throw e;
    }
}

const changeContacts = async (ContactId: string) => {
    try {
        const response = await ContactModel.findOneAndUpdate({ ContactId: ContactId }, { upsert: true, new: true });
        return response;

    } catch (e: any) {
        console.log("[changeContact ERROR] =>  ", e);
        throw e;
    }
}


const deleteContacts = async (ContactId: string) => {
    try {
        const response = await ContactModel.deleteOne({ ContactId: ContactId });
        return response;

    } catch (e: any) {
        console.log("ERROR -> ", e);
    }
}

const MessageService = {
    getContacts,
    createContact,
    changeContacts,
    deleteContacts,
}

export default MessageService; 