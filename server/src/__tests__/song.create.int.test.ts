// server/src/__tests__/songs.create.int.test.ts
import request from "supertest";
import fs from "fs";
import path from "path";
import app from "../index";
import { UPLOAD_DIR } from "../config";

describe("POST /songs — integration test", () => {
  const testImagePath = path.join(__dirname, "assets", "cover.png");

  // Before any test, ensure protected seeds are loaded
  beforeAll(async () => {
    // If your preload runs asynchronously on import, you can await a short delay
    // or better expose a promise from your preload module to await here.
    // For simplicity:
    await new Promise((r) => setTimeout(r, 200));
  });

  it("should create a new song and save its image to disk", async () => {
    const name = "Test Song";
    const artist = "Test Artist";

    const res = await request(app)
      .post("/songs")
      .field("name", name)
      .field("artist", artist)
      .attach("image", testImagePath)
      .expect("Content-Type", /json/)
      .expect(201);

    // 1) Check response shape
    expect(res.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name,
        artist,
        imageUrl: expect.stringContaining("/uploads/"),
      })
    );

    // 2) Verify that the file was written to disk
    const filename = path.basename(res.body.imageUrl);
    const savedPath = path.join(UPLOAD_DIR, filename);
    expect(fs.existsSync(savedPath)).toBe(true);

    // 3) Cleanup: remove the uploaded file so it doesn't pollute other tests
    fs.unlinkSync(savedPath);
  });

  describe("DELETE /songs/:id — integration test", () => {
    const coverPath = path.join(__dirname, "assets", "cover.png");
    let createdId: string;
    let createdFile: string;

    beforeAll(async () => {
      // 1) Create a song to delete
      const res = await request(app)
        .post("/songs")
        .field("name", "To Be Deleted")
        .field("artist", "Test Artist")
        .attach("image", coverPath)
        .expect(201);

      createdId = res.body.id as string;
      createdFile = path.basename(res.body.imageUrl);
      // sanity check: file exists
      expect(fs.existsSync(path.join(UPLOAD_DIR, createdFile))).toBe(true);
    });

    it("should delete the song and remove its file", async () => {
      // 2) Delete it
      const res = await request(app)
        .delete(`/songs/${createdId}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body).toEqual({
        status: "success",
        message: "Song deleted.",
      });

      // 3) File no longer exists on disk
      expect(fs.existsSync(path.join(UPLOAD_DIR, createdFile))).toBe(false);

      // 4) GET /songs no longer returns that id
      const list = await request(app).get("/songs").expect(200);
      const ids = list.body.map((s: any) => s.id);
      expect(ids).not.toContain(createdId);
    });
  });
});
