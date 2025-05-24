import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";
import { HttpError } from "./error.middleware";

/**
 * Middleware to validate request body using a Zod schema.
 * Accepts any Zod type (object, effects, etc).
 */
export const validateSongRequest =
  (schema: ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map((e) => e.message);
      return next(new HttpError(400, errors));
    }

    req.body = result.data;
    next();
  };
