import { Request, Response, NextFunction } from "express";
import path from "path";
import { UPLOAD_DIR } from "../config";
import { promises as fs } from "fs";
import { AnyZodObject } from "zod";
import { HttpError } from "./error.middleware";

// If the image was uploaded, but there are errors in the request body,
// remove the image to avoid orphan files

export const validateSongRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { body, file } = req;

    // Run Zod validation
    const result = schema.safeParse(body);
    if (!result.success) {
      // If a file was uploaded, remove it to avoid orphan files
      if (file) {
        const filePath = path.join(UPLOAD_DIR, file.filename);
        await fs.unlink(filePath).catch(() => void 0);
      }
      // Aggregate Zod error messages
      const errors = result.error.errors.map((e) => e.message);
      throw new HttpError(400, errors);
    }

    // Replace body with the parsed & typed data
    req.body = result.data;

    next();
  };
