import { createSongSchema, updateSongSchema } from "../song.dto";

describe("Song DTO schemas", () => {
  it("createSongSchema accepts valid data", () => {
    const result = createSongSchema.safeParse({
      name: "My Song",
      artist: "My Artist",
    });
    expect(result.success).toBe(true);
  });

  it("createSongSchema rejects empty name", () => {
    const result = createSongSchema.safeParse({
      name: "",
      artist: "Artist",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toMatch(/Name is required/);
    }
  });

  it("updateSongSchema rejects missing artist", () => {
    const result = updateSongSchema.safeParse({
      name: "Song",
      artist: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toMatch(/Artist is required/);
    }
  });
});
