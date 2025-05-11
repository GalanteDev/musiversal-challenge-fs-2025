import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { HttpError } from "./error.middleware";

const idSchema = z.string().uuid("Invalid ID format");

export function validateParamId(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const result = idSchema.safeParse(req.params.id);
  if (!result.success) {
    const errors = result.error.errors.map((e) => e.message);
    throw new HttpError(400, errors);
  }
  next();
}
