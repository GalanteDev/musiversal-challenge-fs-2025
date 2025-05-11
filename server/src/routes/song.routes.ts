import express from "express";
import { upload } from "../middleware/multer.middleware";
import { validateSongRequest } from "../middleware/validateSongRequest.middleware";
import { createSongSchema, updateSongSchema } from "../dtos/song.dto";
import {
  createSong,
  updateSong,
  getAllSongs,
  deleteSong,
} from "../controllers/song.controller";
import { validateParamId } from "../middleware/validateParam.middleware";

const router = express.Router();

router.get("/", getAllSongs);

router.post(
  "/",
  upload.single("image"),
  validateSongRequest(createSongSchema),
  createSong
);

router.put("/:id", validateSongRequest(updateSongSchema), updateSong);

router.delete("/:id", validateParamId, deleteSong);

export default router;
