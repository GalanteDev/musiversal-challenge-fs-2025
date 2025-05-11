import { ErrorRequestHandler } from "express";

export class HttpError extends Error {
  constructor(public statusCode: number, public errors: string[]) {
    super(errors.join("; "));
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ status: "error", errors: err.errors });
  } else {
    console.error("Unexpected error:", err);
    res
      .status(500)
      .json({ status: "error", errors: ["Internal server error"] });
  }
};
