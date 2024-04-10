import express, { Router, Request, Response } from "express";
import ChatController from "../controllers/chats";

const router: Router = express.Router();


// GET /chats/{clientId}
router.get('/:clientId', ChatController.getChats);

// GET /chats/{clientId}/{remoteId}
router.get('/:clientId/:remoteId', ChatController.getChats);

// POST /chats
router.post('/', ChatController.createChats);

// DELETE /chats/{clientId}
router.delete('/:clientId', ChatController.deleteChats);

// DELETE /chats/{clientId}/{remoteId}
router.delete('/:clientId/:remoteId', ChatController.deleteChats);


export default router;