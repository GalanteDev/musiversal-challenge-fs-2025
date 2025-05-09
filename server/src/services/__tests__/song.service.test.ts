import { SongService } from "../song.service";

describe("SongService", () => {
  let service: SongService;

  beforeEach(() => {
    service = new SongService();
  });

  it("should create a song", () => {
    const song = service.create("Test Song", "Test Artist", "test.png");
    expect(song.name).toBe("Test Song");
    expect(service.getAll()).toHaveLength(1);
  });

  it("should prevent duplicate songs", () => {
    service.create("Same", "Artist", "a.png");
    expect(() => service.create("Same", "Artist", "b.png")).toThrow(
      "This song by this artist already exists."
    );
  });

  it("should update a song", () => {
    const song = service.create("Old", "Artist", "x.png");
    const updated = service.update(song.id, "New", "Artist");
    expect(updated?.name).toBe("New");
  });

  it("should delete a song", () => {
    const song = service.create("Kill", "It", "file.png");
    const deleted = service.delete(song.id);
    expect(deleted?.name).toBe("Kill");
    expect(service.getAll()).toHaveLength(0);
  });
});
