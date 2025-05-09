import { Request, Response } from "express";
import { SongService } from "../services/song.service";
import path from "path";
import fs from "fs";
import { sendError } from "../utils/sendError";

const uploadDir = path.join(__dirname, "../../uploads");
const songService = new SongService();

export const getAllSongs = (_req: Request, res: Response): void => {
  const songs = songService.getAll();
  res.json(songs);
};

export const createSong = (req: Request, res: Response): void => {
  const { name, artist } = req.body;
  const file = req.file;

  try {
    if (!name || !artist || !file) {
      return sendError(res, 400, ["Name, artist, and image are required."]);
    }

    const newSong = songService.create(
      name.trim(),
      artist.trim(),
      file.filename
    );
    res.status(201).json(newSong);
  } catch (err) {
    if (file) {
      const filePath = path.join(uploadDir, file.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    const message =
      err instanceof Error ? err.message : "Failed to create song.";
    return sendError(res, 400, [message]);
  }
};

export const updateSong = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { name, artist } = req.body;

  if (!name || !artist) {
    return sendError(res, 400, ["Name and artist are required."]);
  }

  try {
    const updated = songService.update(id, name.trim(), artist.trim());

    if (!updated) {
      return sendError(res, 404, ["Song not found."]);
    }

    res.status(200).json(updated);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update song.";
    return sendError(res, 400, [message]);
  }
};

export const deleteSong = (req: Request, res: Response): void => {
  const { id } = req.params;

  try {
    const deleted = songService.delete(id);

    if (!deleted) {
      return sendError(res, 404, ["Song not found."]);
    }

    const filePath = path.join(uploadDir, path.basename(deleted.imageUrl));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.status(200).json({ status: "success", message: "Song deleted." });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to delete song.";
    return sendError(res, 400, [message]);
  }
};
