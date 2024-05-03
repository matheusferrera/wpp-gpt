import UserModel, { IUser } from "../models/User";
import TemplateModel, { ITemplate } from "../models/Template";


const getUsers = async (userId: string) => {
    try {
        let response;
        if (userId) {
            response = await UserModel.find({ _id: userId });
        } else {
            response = await UserModel.find();
        }

        return response;

    } catch (e: any) {
        console.log("[getUser ERROR] =>  ", e);
        throw e;
    }
}

const getTemplates = async (userId: string) => {
    try {
        let response;
        if (userId) {
            response = await UserModel.find({ _id: userId }, { templates: 1 });
        } 

        return response;

    } catch (e: any) {
        console.log("[getUser ERROR] =>  ", e);
        throw e;
    }
}

const createUser = async (reqBody: IUser) => {
    try {
        const newUser = new UserModel(reqBody);
        const savedUser = await newUser.save();
        return savedUser;
    } catch (e: any) {
        console.log("[createUser ERROR] =>  ", e);
        throw e;
    }
}

const createTemplate = async (userId: string, reqBody: ITemplate) => {
    try {
        const newTemplate = new TemplateModel(reqBody);
        const savedTemplate = await UserModel.findOneAndUpdate(
            { _id: userId },
            { $push: { templates: newTemplate } },
            { returnOriginal: false } // To return the updated document
        );
        return savedTemplate;
    } catch (e: any) {
        console.log("[createTemplate ERROR] =>  ", e);
        throw e;
    }
}

const changeUsers = async (userId: string) => {
    try {
        const response = await UserModel.findOneAndUpdate({ userId: userId }, { upsert: true, new: true });
        return response;

    } catch (e: any) {
        console.log("[changeUser ERROR] =>  ", e);
        throw e;
    }
}


const deleteUsers = async (userId: string) => {
    try {
        const response = await UserModel.deleteOne({ _id: userId });
        return response;

    } catch (e: any) {
        console.log("ERROR -> ", e);
    }
}

const UserService = {
    getUsers,
    getTemplates,
    createUser,
    createTemplate,
    changeUsers,
    deleteUsers,
}

export default UserService; 