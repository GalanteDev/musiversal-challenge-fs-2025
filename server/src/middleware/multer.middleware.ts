import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import { UPLOAD_DIR, MAX_IMAGE_SIZE, ALLOWED_IMAGE_TYPES } from "../config";

async function ensureUploadDir(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    console.error("Could not create upload directory:", err);
    throw err;
  }
}
ensureUploadDir(UPLOAD_DIR).catch(() => process.exit(1));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const id = uuidv4();
    cb(null, `${id}${ext}`);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only: ${ALLOWED_IMAGE_TYPES.join(", ")}`));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter,
});
