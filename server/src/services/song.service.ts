import { songRepository } from "../repositories/song.repository";
import { HttpError } from "../middleware/error.middleware";

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

    return songRepository.delete(id);
  }
}

export const songService = new SongService();
