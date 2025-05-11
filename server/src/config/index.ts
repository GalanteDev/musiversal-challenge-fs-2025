import path from "path";
import dotenv from "dotenv";
import { ProtectedSong } from "@/types/song.types";

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

export const PROTECTED_FILES = [
  "canibalcorpse.png",
  "sepultura.png",
  "slayer.png",
];

export const PROTECTED_SONGS: ProtectedSong[] = [
  {
    name: "Hammer Smashed Face",
    artist: "Cannibal Corpse",
    file: "canibalcorpse.png",
  },
  { name: "Roots Bloody Roots", artist: "Sepultura", file: "sepultura.png" },
  { name: "Raining Blood", artist: "Slayer", file: "slayer.png" },
];
