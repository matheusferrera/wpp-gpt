/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - userId
 *         - clientId
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the client for MongoDB
 *         userId:
 *           type: string
 *           description: The ID of your user
 *         clientId:
 *           type: string
 *           description: The ID of your client
 *         messages:
 *           type: array
 *           description: The user messages for that client
 *       example:
 *         id: d5fE_asz
 *         userId: +5561987665432@us.g
 *         clientId: client_01
 *         messages: Hello, world!
 */

import express, { Router, Request, Response } from "express";
import UserModel from "../models/User";

const router: Router = express.Router();

// GET /chats/test
router.get('/', async (req: Request, res: Response) => {
    try {
        res.send('OK');
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
});

// GET /chats/{clientId}
router.get('/:clientId', async (req: Request, res: Response) => {
    try {
        const clientId = req.params.clientId;
        const user = await UserModel.find({ clientId: clientId });
        res.send(user);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
});

// GET /chats/{clientId}/{userId}
router.get('/:clientId/:userId', async (req: Request, res: Response) => {
    try {
        const clientId = req.params.clientId;
        const userId = req.params.userId;
        const user = await UserModel.findOne({ clientId: clientId, userId: userId });
        res.send(user);
    } catch (e: any) {
        res.status(500).send(e.toString());
    }
});

export default router;