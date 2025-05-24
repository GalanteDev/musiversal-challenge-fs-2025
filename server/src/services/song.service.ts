import { songRepository } from "../repositories/song.repository";
import { HttpError } from "../middleware/error.middleware";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export class SongService {
  async getAll() {
    return songRepository.getAll();
  }

  async create(name: string, artist: string, imageUrl: string, userId: string) {
    const existing = await songRepository.findByNameAndArtist(
      name,
      artist,
      userId
    );

    if (existing) {
      throw new HttpError(400, [
        "Another song with this name and artist already exists.",
      ]);
    }

    return songRepository.create(name, artist, imageUrl, userId); // 👈 imageUrl va bien acá
  }

  async update(id: string, name?: string, artist?: string, imageUrl?: string) {
    const song = await songRepository.findById(id);
    if (!song) throw new HttpError(404, ["Song not found."]);

    return songRepository.update(id, name, artist, imageUrl);
  }

  async delete(id: string) {
    const song = await songRepository.findById(id);
    if (!song) throw new HttpError(404, ["Song not found."]);

    try {
      const url = new URL(song.imageUrl);
      const fullPath = url.pathname.replace("/storage/v1/object/public/", "");
      const path = fullPath.split("/").pop()!;

      const { error: storageError } = await supabase.storage
        .from("songs")
        .remove([path]);

      if (storageError) {
        throw new HttpError(500, ["Failed to delete image from storage."]);
      }
    } catch (err) {
      console.error("Error processing image deletion:", err);
      throw new HttpError(500, ["Invalid image URL."]);
    }

    return songRepository.delete(id);
  }
}

export const songService = new SongService();
