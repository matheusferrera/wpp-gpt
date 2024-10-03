import express, { Router } from "express";
import AuthController from "../controllers/auth";
import { validationMiddleware } from "../validation.middleware";
import { RegisterDto } from "../dto/auth/register.dto";
import { LoginDto } from "../dto/auth/login.dto";

const router: Router = express.Router();

router.post(
  "/register",
  validationMiddleware(RegisterDto),
  AuthController.register
);

router.post(
  "/login",
  validationMiddleware(LoginDto),
  AuthController.login
);

export default router;