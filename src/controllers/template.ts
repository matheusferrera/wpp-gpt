import { Request, Response } from "express";
import TemplateService from "../services/template";

const boasVindas = async (req: Request, res: Response) => {
  try {
    const result = await TemplateService.boasVindas(req.body.remoteId);
    const clientIP = req.headers["x-forwarded-for"];
    console.log("IP DA REQ -> ", clientIP);
    res.send(result);
  } catch (e: any) {
    res.status(500).send(e.toString());
  }
};

const TemplateController = {
  boasVindas,
};

export default TemplateController;
