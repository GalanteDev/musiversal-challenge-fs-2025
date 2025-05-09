import express from "express";
import {
  getAllSongs,
  createSong,
  updateSong,
  deleteSong,
} from "../controllers/song.controller";
import { uploadAndValidate } from "../middleware/uploadAndValidate.middleware";

const router = express.Router();

router.get("/", getAllSongs);
router.post("/", uploadAndValidate, createSong);
router.put("/:id", updateSong);
router.delete("/:id", deleteSong);

export default router;
