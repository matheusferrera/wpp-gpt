import express, { Router, Request, Response } from "express";
import WppController from "../controllers/wpp";
import { validationMiddleware } from "../validation.middleware";
import { SendMessageDto } from "../dto/message/sendMessage.dto";
import { SendMessageMassiveDto } from "../dto/message/sendMassiveMessage.dto";
import { authMiddleware } from "../auth.middleware";

const router: Router = express.Router();


// Proteja todas as rotas com o middleware de autenticação
router.use(authMiddleware);


// GET /messages
router.get("/qrCode", WppController.getQrCode);

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
