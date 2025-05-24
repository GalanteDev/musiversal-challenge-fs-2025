import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

export const UPLOAD_DIR = process.env.UPLOAD_DIR
  ? path.resolve(process.cwd(), process.env.UPLOAD_DIR)
  : path.resolve(__dirname, "../../uploads");

export const MAX_IMAGE_SIZE = process.env.MAX_IMAGE_SIZE
  ? parseInt(process.env.MAX_IMAGE_SIZE, 10)
  : 2 * 1024 * 1024; // 2MB

export const ALLOWED_IMAGE_TYPES = process.env.ALLOWED_IMAGE_TYPES
  ? process.env.ALLOWED_IMAGE_TYPES.split(",")
  : ["image/jpeg", "image/png", "image/gif"];

export const SUPABASE_URL = process.env.SUPABASE_URL!;
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
export const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET!;
