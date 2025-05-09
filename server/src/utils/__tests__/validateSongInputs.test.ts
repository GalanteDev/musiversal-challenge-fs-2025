import { validateSongInput } from "../validateSongInput";

describe("validateSongInput", () => {
  it("returns error if name is missing", () => {
    const result = validateSongInput({
      name: "",
      artist: "Artist",
      file: { filename: "a.jpg" },
    });
    expect(result).toContain("Name is required.");
  });

  it("returns error if artist is missing", () => {
    const result = validateSongInput({
      name: "Song",
      artist: "",
      file: { filename: "a.jpg" },
    });
    expect(result).toContain("Artist is required.");
  });

  it("returns error if file is missing", () => {
    const result = validateSongInput({
      name: "Song",
      artist: "Artist",
      file: null,
    });
    expect(result).toContain("Album cover image is required.");
  });

  it("returns no errors for valid input", () => {
    const result = validateSongInput({
      name: "Test",
      artist: "Band",
      file: { filename: "x.jpg" },
    });
    expect(result).toEqual([]);
  });
});
