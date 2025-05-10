import { Request, Response, NextFunction } from "express";
import { upload } from "./upload.middleware";
import path from "path";
import fs from "fs";

export const uploadAndValidate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      const errorMessage =
        err.code === "LIMIT_FILE_SIZE"
          ? "Image is too large. Max size is 2MB."
          : err.message || "File upload failed.";

      return res.status(400).json({ error: errorMessage });
    }

    const { name, artist } = req.body;

    const isInvalid =
      !name ||
      typeof name !== "string" ||
      name.trim().length === 0 ||
      !artist ||
      typeof artist !== "string" ||
      artist.trim().length === 0;

    if (isInvalid) {
      if (req.file) {
        const filePath = path.join(
          __dirname,
          "../../uploads",
          req.file.filename
        );
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      return res.status(400).json({ error: "Name and artist are required." });
    }

    next();
  });
};
