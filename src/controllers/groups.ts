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
        const clientId = req.params.clientId;
        const title = req.body.title;
        const participants = req.body.participants;
        const response = await GroupService.createGroups(clientId, title, participants);
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}

const getLabels = async(req: Request, res: Response) => {
    try {
        const clientId = req.params.clientId;
        const remoteId = req.params.remoteId;
        const response = await GroupService.getLabels(clientId, remoteId);
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}

const createLabels = async(req: Request, res: Response) => {
    try {
        const clientId = req.params.clientId;
        const remoteId = req.params.remoteId;
        const label = req.body.label;
        const response = await GroupService.createLabels(clientId, remoteId, label);
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}

const updateGroups = async(req: Request, res: Response) => {
    try {
        const clientId = req.params.clientId;
        const remoteId = req.params.remoteId;
        const subject = req.body.subject;
        const response = await GroupService.updateGroups(clientId, remoteId, subject);
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}

const deleteGroups = async(req: Request, res: Response) => {
    try {
        const clientId = req.params.clientId;
        const remoteId = req.params.remoteId;
        console.log("DELETE -> ", clientId);
        const response = await GroupService.deleteGroups(clientId, remoteId);
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}

const GroupController = {
    getGroups,
    createGroups,
    getLabels,
    createLabels,
    updateGroups,
    deleteGroups
}

export default GroupController