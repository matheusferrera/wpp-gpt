import express, { Router, Request, Response } from "express";
import MessageController from "../controllers/messages";
import { validationMiddleware } from "../validation.middleware";
import { SendMessageDto } from "../dto/message/sendMessage.dto";
import { SendMessageMassiveDto } from "../dto/message/sendMassiveMessage.dto";

const router: Router = express.Router();

// GET /messages
router.get("/:clientId/:limit", MessageController.getMessages);

// POST /messages
router.post(
  "/",
  validationMiddleware(SendMessageDto),
  MessageController.sendMessages.bind(MessageController)
);

// POST /messages/massive
router.post(
  "/massive",
  validationMiddleware(SendMessageMassiveDto),
  MessageController.sendMessagesMassive.bind(MessageController)
);

export default router;
