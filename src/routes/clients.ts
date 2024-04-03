/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       required:
 *         - id
 *         - clientId
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the client for MongoDB
 *         clientId:
 *           type: string
 *           description: The ID of your client
 *         name:
 *           type: string
 *           description: The client name
 *       example:
 *         id: d5fE_asz
 *         clientId: client_01
 *         name: Loja 1
 */

import express, { Router, Request, Response } from "express";
import ClientModel from "../models/Client";

const router: Router = express.Router();

// GET /clients
router.get('/', async (req: Request, res: Response) => {
    try {
        const clients = await ClientModel.find();
        res.send(clients);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
});

// GET /clients/{clientId}
router.get('/:clientId', async (req: Request, res: Response) => {
    try {
        const clientId = req.params.clientId;
        const user = await ClientModel.find({ clientId: clientId });
        res.send(user);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
});

// POST /clients
router.post('/', async (req: Request, res: Response) => {
    try {
        const clientId = req.body.clientId;
        const client = await ClientModel.findOneAndUpdate({ clientId: clientId }, { upsert: true, new: true });
        res.send(client);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
});

export default router;