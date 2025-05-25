// src/services/__tests__/song.service.test.ts
import { SongService } from "../song.service";
import * as songRepositoryModule from "../../repositories/song.repository";
import { HttpError } from "../../middleware/error.middleware";

// Mock the songRepository module
jest.mock("../../repositories/song.repository");

// Mock Supabase client and .remove method to avoid errors in tests
jest.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        remove: jest.fn().mockResolvedValue({ data: null, error: null }),
      }),
    },
  }),
}));

const mockedSongRepository = songRepositoryModule.songRepository as jest.Mocked<
  typeof songRepositoryModule.songRepository
>;
const songService = new SongService();

describe("SongService unit tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a song successfully", async () => {
      mockedSongRepository.findByNameAndArtist.mockResolvedValue(null);
      mockedSongRepository.create.mockResolvedValue({
        id: "song-1",
        name: "New Song",
        artist: "Artist",
        imageUrl: "image.png",
        userId: "user-1",
      });

      const result = await songService.create(
        "New Song",
        "Artist",
        "image.png",
        "user-1"
      );

      expect(mockedSongRepository.findByNameAndArtist).toHaveBeenCalledWith(
        "New Song",
        "Artist",
        "user-1"
      );
      expect(mockedSongRepository.create).toHaveBeenCalledWith(
        "New Song",
        "Artist",
        "image.png",
        "user-1"
      );
      expect(result).toHaveProperty("id", "song-1");
    });

    it("should throw HttpError if song already exists", async () => {
      mockedSongRepository.findByNameAndArtist.mockResolvedValue({
        id: "song-1",
      } as any);

      await expect(
        songService.create("Existing Song", "Artist", "image.png", "user-1")
      ).rejects.toThrow(HttpError);

      expect(mockedSongRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update a song successfully", async () => {
      mockedSongRepository.findById.mockResolvedValue({
        id: "song-1",
        name: "Old Song",
        artist: "Old Artist",
        imageUrl: "old.png",
        userId: "user-1",
      });

      mockedSongRepository.update.mockResolvedValue({
        id: "song-1",
        name: "Updated Song",
        artist: "Updated Artist",
        imageUrl: "updated.png",
        userId: "user-1",
      });

      const result = await songService.update(
        "song-1",
        "Updated Song",
        "Updated Artist",
        "updated.png"
      );

      expect(mockedSongRepository.findById).toHaveBeenCalledWith("song-1");
      expect(mockedSongRepository.update).toHaveBeenCalledWith(
        "song-1",
        "Updated Song",
        "Updated Artist",
        "updated.png"
      );
      expect(result.name).toBe("Updated Song");
    });

    it("should throw HttpError 404 if song not found", async () => {
      mockedSongRepository.findById.mockResolvedValue(null);

      await expect(
        songService.update("song-404", "Name", "Artist", "image.png")
      ).rejects.toThrow(HttpError);

      expect(mockedSongRepository.findById).toHaveBeenCalledWith("song-404");
      expect(mockedSongRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete a song successfully", async () => {
      mockedSongRepository.findById.mockResolvedValue({
        id: "song-1",
        name: "Delete Song",
        artist: "Artist",
        imageUrl: "https://supabase-url/songs/delete.png",
        userId: "user-1",
      });
      mockedSongRepository.delete.mockResolvedValue({
        id: "song-1",
        name: "Delete Song",
        artist: "Artist",
        imageUrl: "https://supabase-url/songs/delete.png",
        userId: "user-1",
      });

      const result = await songService.delete("song-1");

      expect(mockedSongRepository.findById).toHaveBeenCalledWith("song-1");
      expect(mockedSongRepository.delete).toHaveBeenCalledWith("song-1");
      expect(result).toHaveProperty("id", "song-1");
    });

    it("should throw HttpError 404 if song to delete not found", async () => {
      mockedSongRepository.findById.mockResolvedValue(null);

      await expect(songService.delete("song-404")).rejects.toThrow(HttpError);

      expect(mockedSongRepository.findById).toHaveBeenCalledWith("song-404");
      expect(mockedSongRepository.delete).not.toHaveBeenCalled();
    });
  });
});
