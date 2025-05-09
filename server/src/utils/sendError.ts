import { Response } from "express";

export function sendError(
  res: Response,
  status: number,
  errors: string[]
): void {
  res.status(status).json({ status: "error", errors });
}
