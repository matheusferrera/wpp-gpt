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