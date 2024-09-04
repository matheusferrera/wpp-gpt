import { PaginationDto } from "../dto/query/pagination.dto";
import express, { Router, Request, Response } from "express";
import MessageController from "../controllers/messages";
import {
  validationMiddleware,
  validationMiddlewareGet,
} from "../validation.middleware";
import { PatchMessageDto } from "../dto/message/PatchMessage.dto";

const router: Router = express.Router();

router.get(
  "/",
  validationMiddlewareGet(PaginationDto),
  MessageController.getMessages.bind(MessageController)
);

router.patch(
  "/",
  validationMiddleware(PatchMessageDto),
  MessageController.patchMessages.bind(MessageController)
);

export default router;
