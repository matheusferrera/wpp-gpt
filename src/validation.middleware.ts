import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";

export function validationMiddleware(type: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(type, req.body);
    validate(dtoInstance).then((errors) => {
      if (errors.length > 0) {
        const message = errors
          .map((error) => Object.values(error.constraints || {}))
          .join(", ");
        res.status(400).json({ message });
      } else {
        req.body = dtoInstance;
        next();
      }
    });
  };
}

export function validationMiddlewareGet(type: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(type, req.query as object);
    console.log("DTO INSTANCE no validation -> ", dtoInstance);
    validate(dtoInstance as object).then((errors) => {
      if (errors.length > 0) {
        const message = errors
          .map((error) => Object.values(error.constraints || {}))
          .join(", ");
        res.status(400).json({ message });
      } else {
        req.query = dtoInstance as any;
        next();
      }
    });
  };
}
