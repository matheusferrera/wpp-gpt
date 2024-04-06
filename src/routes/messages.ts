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
 *     MessageRequestBody:
 *       type: object
 *       required:
 *         - clientId
 *         - userId
 *         - message
 *       properties:
 *         clientId:
 *           type: string
 *           description: The ID of the WhatsApp client
 *         userId:
 *           type: string
 *           description: The ID of the user (recipient of the message)
 *         message:
 *           type: string
 *           description: The text message to be sent
 *         mimeType:
 *           type: string
 *           description: MIME type of the attachment
 *         media:
 *           type: string
 *           description: Base64-encoded data of the file
 *       example:
 *         clientId: client_01
 *         userId: +5561987665432@us.g
 *         message: Hello!
 *         mimeType: image/jpeg
 *         media: ewogICJjbGllbnRJZCI6ICJ...
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


/**
 * @swagger
 * tags:
 *   - name: Messages
 *     description: Operations with chat messages
 *   - name: QRCode
 *     description: QRCode generation for login and synchronization
 * /qrcode/{clientId}:
 *   get:
 *     summary: Generate QRCode text (string) for a given clientId
 *     tags: [QRCode]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         schema:
 *           type: string
 *         required: true
 *         description: The client id
 *     responses:
 *       200:
 *         description: The QRCode text
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 properties:
 *                   code:
 *                     type: string
 *                     description: QRCode string
 *               example:
 *                 code: xxxxxxxxxxxxxxxxx
 * /messages:
 *   get:
 *     summary: Lists all the messages
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: The list of the saved messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *   post:
 *     summary: Create a new message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MessageRequestBody'
 *     responses:
 *       200:
 *         description: The created message.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       500:
 *         description: Some server error
 * /messages/{clientId}:
 *   get:
 *     summary: Get the clients' messages
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The client id
 *     responses:
 *       200:
 *         description: The client response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       404:
 *         description: The message was not found
 *   delete:
 *     summary: Remove all the client's messages
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The client id
 *     responses:
 *       200:
 *         description: The message was deleted
 *       404:
 *         description: The message was not found
 * /messages/{clientId}/{userId}:
 *   get:
 *     summary: Get the all the messages from a user to a client
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         schema:
 *           type: string
 *         required: true
 *         description: The client id
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The messages for a user to a client
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       404:
 *         description: Messages not found
 *   delete:
 *     summary: Remove all the client's messages
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The client id
 *     responses:
 *       200:
 *         description: The message was deleted
 *       404:
 *         description: The message was not found
 */

import express, { Router, Request, Response } from "express";
import MessageController from "../controllers/messages";

const router: Router = express.Router();


// GET /messages/{clientId}
router.get('/:clientId', MessageController.getMessages);

// GET /messages/{clientId}/{userId}
router.get('/:clientId/:userId', MessageController.getMessages);

// POST /messages
router.post('/', MessageController.createMessages);

// DELETE /messages/{clientId}
router.delete('/:clientId', MessageController.deleteMessages);

// DELETE /messages/{clientId}/{userId}
router.delete('/:clientId/:userId', MessageController.deleteMessages);


export default router;