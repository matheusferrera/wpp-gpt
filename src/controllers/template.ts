import { Request, Response } from "express";
import TemplateService from "../services/template";

const boasVindas = async (req: Request, res: Response) => {
  try {
    console.log("SEND TEMPLATE!!");
    const clientIP =
      (req.headers["x-forwarded-for"] as string) ||
      (req.socket.remoteAddress as string);

    let ipFiltered = clientIP.match(/(\d{1,3}\.){3}\d{1,3}/)?.toString() || "";

    if (ipFiltered == "") {
      ipFiltered = "177.201.81.97";
    }
    console.log("IP filterede -> ", ipFiltered);
    const result = await TemplateService.boasVindas(
      req.body.remoteId,
      ipFiltered
    );

    res.send(result);
  } catch (e: any) {
    res.status(500).send(e.toString());
  }
};

const TemplateController = {
  boasVindas,
};

export default TemplateController;
