import { ZodObject, ZodRawShape } from 'zod';
import { NextFunction, Request, Response } from 'express';

const validateRequest =
  (schema: ZodObject<ZodRawShape>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
        cookies: req.cookies,
      });
      next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;
