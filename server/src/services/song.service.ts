import { Song } from "../types/song.types";
import { v4 as uuidv4 } from "uuid";

export class SongService {
  private songs: Song[] = [];

  getAll(): Song[] {
    return this.songs;
  }

  create(name: string, artist: string, filename: string): Song {
    const normalizedName = name.trim().toLowerCase();
    const normalizedArtist = artist.trim().toLowerCase();

    const duplicate = this.songs.some(
      (song) =>
        song.name.trim().toLowerCase() === normalizedName &&
        song.artist.trim().toLowerCase() === normalizedArtist
    );

    if (duplicate) {
      throw new Error("This song by this artist already exists.");
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

  delete(id: string): Song | null {
    const index = this.songs.findIndex((s) => s.id === id);
    if (index === -1) return null;
    const [deleted] = this.songs.splice(index, 1);
    return deleted;
  }

  update(id: string, name: string, artist: string): Song | null {
    const song = this.songs.find((s) => s.id === id);
    if (!song) return null;

    // Check for duplicate name + artist in other songs
    const duplicate = this.songs.some(
      (s) =>
        s.id !== id &&
        s.name.trim().toLowerCase() === name.trim().toLowerCase() &&
        s.artist.trim().toLowerCase() === artist.trim().toLowerCase()
    );

    if (duplicate) {
      throw new Error("Another song with this name and artist already exists.");
    }

    song.name = name;
    song.artist = artist;
    return song;
  }
}
