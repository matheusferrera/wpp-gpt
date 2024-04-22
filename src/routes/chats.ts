import express, { Router, Request, Response } from "express";
import ChatController from "../controllers/chats";

const router: Router = express.Router();


// GET /chats/{clientId}
router.get('/:clientId', ChatController.getChats);

// GET /chats/{clientId}/{remoteId}
router.get('/getMessage/:clientId/:wppNumber', ChatController.getMessagesChats);

// POST /chats
router.post('/sendMessage/', ChatController.createChats);


export default router;