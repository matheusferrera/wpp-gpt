import {Request, Response } from "express";
import UserService from "../services/users";

const getUsers = async(req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const response = await UserService.getUsers(userId);
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}

const getTemplates = async(req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const response = await UserService.getTemplates(userId);
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}

const createUsers = async(req: Request, res: Response) => {
    try {
        const reqBody = req.body;
        const response = await UserService.createUser(reqBody);
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}

const createTemplates = async(req: Request, res: Response) => {
    try {
        const reqBody = req.body;
        const response = await UserService.createTemplate(reqBody);
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}

const changeUsers = async(req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const response = await UserService.changeUsers(userId);
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}

const deleteUsers = async(req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        console.log("DELETE -> ", userId);
        const response = await UserService.deleteUsers(userId);
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}

const UsersController = {
    getUsers,
    getTemplates,
    createUsers,
    createTemplates,
    changeUsers,
    deleteUsers
}

export default UsersController;