import express, { Router, Request, Response } from "express";
import WppController from "../controllers/wpp";
import { validationMiddleware } from "../validation.middleware";
import { SendMessageDto } from "../dto/message/sendMessage.dto";
import { SendMessageMassiveDto } from "../dto/message/sendMassiveMessage.dto";

const router: Router = express.Router();

// GET /messages
router.get("/:clientId/:limit", WppController.getMessages);

// POST /messages
router.post(
  "/",
  validationMiddleware(SendMessageDto),
  WppController.sendMessages.bind(WppController)
);

// POST /messages/massive
router.post(
  "/massive",
  validationMiddleware(SendMessageMassiveDto),
  WppController.sendMessagesMassive.bind(WppController)
);

export default router;
