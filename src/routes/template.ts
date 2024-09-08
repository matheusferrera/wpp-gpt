import express, { Router, Request, Response } from "express";
import TemplateController from "../controllers/template";

const router: Router = express.Router();

router.post("/boas-vindas", TemplateController.boasVindas);

export default router;
