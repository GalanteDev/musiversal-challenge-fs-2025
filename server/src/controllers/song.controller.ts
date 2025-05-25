// src/controllers/song.controller.ts
import { Request, Response, NextFunction } from "express";
import { songService } from "../services/song.service";
import { HttpError } from "../middleware/error.middleware";
import { AuthRequest } from "@/middleware/auth.middleware";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { getExtensionFromMimeType } from "../helpers";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * @swagger
 * tags:
 *   name: Songs
 *   description: Song management endpoints
 */

/**
 * @swagger
 * /songs:
 *   get:
 *     summary: Retrieve all songs
 *     tags: [Songs]
 *     responses:
 *       200:
 *         description: A list of songs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Song'
 */
export const getAllSongs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res
        .status(401)
        .json({ error: "Unauthorized: user not found in request." });
      return;
    }
    const songs = await songService.getAllByUserId(userId);
    res.json(songs);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /songs:
 *   post:
 *     summary: Upload a new song, including cover image
 *     tags: [Songs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - artist
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 description: The song title
 *               artist:
 *                 type: string
 *                 description: The performing artist
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Cover image file
 *     responses:
 *       201:
 *         description: Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       400:
 *         description: Bad request (missing fields or invalid file)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const createSong = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, artist, imageUrl } = req.body;

  const userId = req.user!.id;

  try {
    const newSong = await songService.create(name, artist, imageUrl, userId);
    res.status(201).json(newSong);
  } catch (err) {
    next(err);
  }
};

export const updateSong = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const { name, artist, imageUrl } = req.body;
  const userId = req.user!.id;

  try {
    const song = await songService.findById(id);
    if (!song) {
      throw new HttpError(404, ["Song not found."]);
    }

    if (song.userId !== userId) {
      throw new HttpError(403, ["You are not authorized to update this song."]);
    }

    const updated = await songService.update(id, name, artist, imageUrl);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteSong = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const userId = req.user!.id;

  try {
    const song = await songService.findById(id);
    if (!song) {
      throw new HttpError(404, ["Song not found."]);
    }

    if (song.userId !== userId) {
      throw new HttpError(403, ["You are not authorized to delete this song."]);
    }

    await songService.delete(id);
    res.json({ status: "success", message: "Song deleted." });
  } catch (err) {
    next(err);
  }
};

export const getSignedUploadUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fileType } = req.body;

    if (!fileType || !fileType.startsWith("image/")) {
      res.status(400).json({ error: "Invalid file type." });
      return;
    }

    const extension = getExtensionFromMimeType(fileType);
    if (!extension) {
      res.status(400).json({ error: "Unsupported file type." });
      return;
    }

    const fileName = `${uuidv4()}.${extension}`;
    const { data, error } = await supabase.storage
      .from("songs")
      .createSignedUploadUrl(fileName);

    if (error) throw error;

    res.status(200).json({
      fileName,
      uploadUrl: data.signedUrl,
      publicUrl: `${process.env.SUPABASE_URL}/storage/v1/object/public/songs/${fileName}`,
    });
  } catch (err) {
    next(err);
  }
};
