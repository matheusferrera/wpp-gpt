import { Request, Response } from "express";
import GroupService from "../services/groups";

const getGroups = async(req: Request, res: Response) => {
    try {
        const clientId = req.params.clientId;
        const remoteId = req.params.remoteId;
        const response = await GroupService.getGroups(clientId, remoteId);
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}

const createGroups = async(req: Request, res: Response) => {
    try {
        const clientId = req.body.clientId;
        const title = req.body.title;
        const participants = req.body.participants;
        const response = await GroupService.createGroups(clientId, title, participants);
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}

const deleteGroups = async(req: Request, res: Response) => {
    try {
        const clientId = req.params.clientId;
        const remoteId = req.params.remoteId;
        console.log("DETE -> ", clientId);
        const response = await GroupService.deleteGroups(clientId, remoteId);
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}

const GroupController = {
    getGroups,
    createGroups,
    deleteGroups
}

export default GroupController