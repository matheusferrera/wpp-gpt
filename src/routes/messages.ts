import express, { Router, Request, Response } from "express";
import MessageController from "../controllers/messages";
import { validationMiddleware } from "../validation.middleware";
import { SendMessageDto } from "../dto/message/sendMessage.dto";

const router: Router = express.Router();

// GET /messages
router.get("/:clientId/:limit", MessageController.getMessages);

// POST /messages
router.post(
  "/",
  validationMiddleware(SendMessageDto),
  MessageController.sendMessages.bind(MessageController)
);

export default router;
