import express from "express";
import {
  getAllSongs,
  createSong,
  updateSong,
  deleteSong,
} from "../controllers/song.controller";
import { uploadAndValidate } from "../middleware/uploadAndValidate.middleware";

const router = express.Router();

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
 *     summary: Get all songs
 *     tags: [Songs]
 *     responses:
 *       200:
 *         description: List of songs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Song'
 */
router.get("/", getAllSongs);

/**
 * @swagger
 * /songs:
 *   post:
 *     summary: Upload a new song with image
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
 *               artist:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Song created successfully
 *       400:
 *         description: Validation or upload error
 */
router.post("/", uploadAndValidate, createSong);

/**
 * @swagger
 * /songs/{id}:
 *   put:
 *     summary: Update an existing song
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Song ID
 *         schema:
 *           type: string
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
 *         description: Song updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Song not found
 */
router.put("/:id", updateSong);

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
 *         description: Song ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Song deleted successfully
 *       404:
 *         description: Song not found
 */
router.delete("/:id", deleteSong);

export default router;
