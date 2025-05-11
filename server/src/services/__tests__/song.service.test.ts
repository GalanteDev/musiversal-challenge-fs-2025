import { SongService } from "../song.service";
import { HttpError } from "../../middleware/error.middleware";

describe("SongService Unit Tests", () => {
  let service: SongService;

  beforeEach(() => {
    service = new SongService();
  });

  test("getAll should return empty array initially", async () => {
    const songs = await service.getAll();
    expect(Array.isArray(songs)).toBe(true);
    expect(songs).toHaveLength(0);
  });

  test("create should add and return a new song", async () => {
    const song = await service.create("Test Song", "Test Artist", "test.png");
    expect(song).toMatchObject({
      name: "Test Song",
      artist: "Test Artist",
      imageUrl: "/uploads/test.png",
    });
    const all = await service.getAll();
    expect(all).toHaveLength(1);
  });

  test("create should throw HttpError on duplicate", async () => {
    await service.create("Dup Song", "Dup Artist", "dup.png");
    await expect(
      service.create("Dup Song", "Dup Artist", "dup2.png")
    ).rejects.toBeInstanceOf(HttpError);
  });

  test("delete should remove and return the song", async () => {
    const song = await service.create("Del Song", "Del Artist", "del.png");
    const deleted = await service.delete(song.id);
    expect(deleted).not.toBeNull();
    expect(deleted!.id).toBe(song.id);
    const allAfter = await service.getAll();
    expect(allAfter).toHaveLength(0);
  });

  test("delete should throw HttpError when song not found", async () => {
    await expect(service.delete("non-existent-id")).rejects.toBeInstanceOf(
      HttpError
    );
  });
});
