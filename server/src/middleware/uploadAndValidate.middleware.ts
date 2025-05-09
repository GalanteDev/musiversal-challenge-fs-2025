import { Request, Response, NextFunction } from "express";
import { upload } from "./upload.middleware";
import path from "path";
import fs from "fs";
import { validateSongInput } from "../utils/validateSongInput";
import { sendError } from "../utils/sendError";

export const uploadAndValidate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  upload.single("image")(req, res, (err) => {
    if (err) return sendError(res, 400, [err.message]);

    const file = req.file ? { filename: req.file.filename } : null;

    const errors = validateSongInput({
      name: req.body?.name,
      artist: req.body?.artist,
      file,
    });

    if (errors.length > 0) {
      if (file) {
        const filePath = path.join(__dirname, "../../uploads", file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      return sendError(res, 400, errors);
    }

    next();
  });
};
