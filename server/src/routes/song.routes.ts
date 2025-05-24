import express from "express";
import { validateSongRequest } from "../middleware/validateSongRequest.middleware";
import { createSongSchema, updateSongSchema } from "../dtos/song.dto";
import {
  createSong,
  updateSong,
  getAllSongs,
  deleteSong,
  getSignedUploadUrl,
} from "../controllers/song.controller";
import { validateParamId } from "../middleware/validateParam.middleware";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", authenticate, getAllSongs);

router.post(
  "/",
  authenticate,
  validateSongRequest(createSongSchema),
  createSong
);

router.put(
  "/:id",
  authenticate,
  validateParamId,
  validateSongRequest(updateSongSchema),
  updateSong
);

router.delete("/:id", authenticate, validateParamId, deleteSong);

router.post("/upload-url", authenticate, getSignedUploadUrl);

export default router;
