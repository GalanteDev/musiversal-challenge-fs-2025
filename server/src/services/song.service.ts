import { Song } from "../types/song.types";
import { v4 as uuidv4 } from "uuid";
import { HttpError } from "../middleware/error.middleware";
import { PROTECTED_FILES, UPLOAD_DIR } from "../config";
import path from "path";
import fs from "fs/promises";

export class SongService {
  private songs: Song[] = [];
  private protectedFiles = PROTECTED_FILES;

  async getAll(): Promise<Song[]> {
    return this.songs;
  }

  async create(name: string, artist: string, filename: string): Promise<Song> {
    const normalizedName = name.trim().toLowerCase();
    const normalizedArtist = artist.trim().toLowerCase();

    const duplicate = this.songs.some(
      (song) =>
        song.name.trim().toLowerCase() === normalizedName &&
        song.artist.trim().toLowerCase() === normalizedArtist
    );

    if (duplicate) {
      throw new HttpError(400, [
        "Another song with this name and artist already exists.",
      ]);
    }

    const newSong: Song = {
      id: uuidv4(),
      name,
      artist,
      imageUrl: `/uploads/${filename}`,
    };

    this.songs.push(newSong);
    return newSong;
  }

  async update(id: string, name: string, artist: string): Promise<Song> {
    const song = this.songs.find((s) => s.id === id);
    if (!song) {
      throw new HttpError(404, ["Song not found."]);
    }

    const duplicate = this.songs.some(
      (s) =>
        s.id !== id &&
        s.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        s.artist.trim().toLowerCase() === artist.trim().toLowerCase()
    );

    if (duplicate) {
      throw new HttpError(400, [
        "Another song with this name and artist already exists.",
      ]);
    }

    song.name = name;
    song.artist = artist;
    return song;
  }

  async delete(id: string): Promise<Song> {
    const index = this.songs.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new HttpError(404, ["Song not found."]);
    }
    const [deleted] = this.songs.splice(index, 1);

    const filename = path.basename(deleted.imageUrl);
    const filePath = path.join(UPLOAD_DIR, filename);
    await fs.unlink(filePath).catch(() => {});

    return deleted;
  }
}

export const songService = new SongService();
