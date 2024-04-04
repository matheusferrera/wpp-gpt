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
 *     Message:
 *       type: object
 *       required:
 *         - ack
 *         - body
 *         - deviceType
 *         - forwardingScore
 *         - from
 *         - fromMe
 *         - hasMedia
 *         - hasQuotedMsg
 *         - hasReaction
 *         - id
 *         - isForwarded
 *         - isGif
 *         - isStarred
 *         - isStatus
 *         - links
 *         - mentionedIds
 *         - timestamp
 *         - to
 *         - type
 *         - vCards
 *       properties:
 *         ack:
 *           type: number
 *           description: If the message was received by the recipient
 *         body:
 *           type: string
 *           description: The message text
 *         deviceType:
 *           type: string
 *           description: The device type
 *         forwardingScore:
 *           type: number
 *           description: The forwarding score
 *         from:
 *           type: string
 *           description: The number the message came from
 *         fromMe:
 *           type: boolean
 *           description: If the message is from you
 *         hasMedia:
 *           type: boolean
 *           description: If the message has media
 *         hasQuotedMsg:
 *           type: boolean
 *           description: If the message has quotes
 *         hasReaction:
 *           type: boolean
 *           description: If the message has reaction
 *         id:
 *           type: object
 *           description: The id of the message in WhatsApp
 *         isForwarded:
 *           type: boolean
 *           description: If the message is forwarded
 *         isGif:
 *           type: boolean
 *           description: If the message is a gif
 *         isStarred:
 *           type: boolean
 *           description: If the message is starred
 *         isStatus:
 *           type: boolean
 *           description: If the message is a status
 *         links:
 *           type: array
 *           description: The links
 *         mentionedIds:
 *           type: array
 *           description: The mentioned IDs
 *         timestamp:
 *           type: number
 *           description: The message's timestamp
 *         to:
 *           type: string
 *           description: Who the message was sent to
 *         type:
 *           type: string
 *           description: The message type
 *         vCards:
 *           type: array
 *           description: The vCards
 *       example:
 *         ack: d5fE_asz
 *         body: +5561987665432@us.g
 *         deviceType: ios
 *         forwardingScore: 0
 *         from: 120363277863324828@g.us
 *         fromMe: false
 *         hasMedia: false
 *         hasQuotedMsg: true
 *         hasReaction: false
 *         id: {froMe: false, remote: 120363288861124838@g.us, 3A6E2EFG79125C4B0FF1, participant: 5521983148987@c.us}
 *         isForwarded: false
 *         isGif: false
 *         isStarred: false
 *         isStatus: false
 *         links: []
 *         mentionedIds: []
 *         timestamp: 1712155837
 *         to: 556182639146@c.us
 *         type: chat
 *         vCards: []
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