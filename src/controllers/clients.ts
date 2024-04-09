import {Request, Response } from "express";
import ClientService from "../services/clients";

const getClients = async(req: Request, res: Response) => {
    try {
        const clientId = req.params.clientId;
        const response = await ClientService.getClients(clientId);
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}

const createClients = async(req: Request, res: Response) => {
    try {
        const reqBody = req.body;
        const response = await ClientService.createClient(reqBody);
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}

const changeClients = async(req: Request, res: Response) => {
    try {
        const clientId = req.params.clientId;
        const response = await ClientService.changeClients(clientId);
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}

const activeClients = async(req: Request, res: Response) => {
    try {
        const clientId = req.params.clientId;
        const response = await ClientService.activeClients(clientId);
        console.log("CONTROLLER -> ", response)
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}

const deleteClients = async(req: Request, res: Response) => {
    try {
        const clientId = req.params.clientId;
        console.log("DELETE -> ", clientId);
        const response = await ClientService.deleteClients(clientId);
        res.send(response);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
}

const ClientController = {
    getClients,
    createClients,
    changeClients,
    deleteClients,
    activeClients
}

export default ClientController;