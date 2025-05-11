// src/controllers/song.controller.ts
import { Request, Response, NextFunction } from "express";
import { songService } from "../services/song.service";
import { HttpError } from "../middleware/error.middleware";

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
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const songs = await songService.getAll();
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
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, artist } = req.body;
  const file = req.file!;

  try {
    const newSong = await songService.create(name, artist, file.filename);
    res.status(201).json(newSong);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /songs/{id}:
 *   put:
 *     summary: Update name and artist of a song
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Song identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - artist
 *             properties:
 *               name:
 *                 type: string
 *               artist:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Song not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const updateSong = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const { name, artist } = req.body;

  try {
    const updated = await songService.update(id, name, artist);
    if (!updated) {
      throw new HttpError(404, ["Song not found."]);
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * @swagger
 * /songs/{id}:
 *   delete:
 *     summary: Delete a song by ID
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Song identifier
 *     responses:
 *       200:
 *         description: Deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Song not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const deleteSong = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const deleted = await songService.delete(id);
    if (!deleted) {
      throw new HttpError(404, ["Song not found."]);
    }
    res.json({ status: "success", message: "Song deleted." });
  } catch (err) {
    next(err);
  }
};
