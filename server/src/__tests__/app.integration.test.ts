import request from "supertest";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import type { Express } from "express";
import { startTestDatabase } from "../test-utils/setup/postgres.testcontainer";

// Mock supabase-js to avoid real calls in tests
jest.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        createSignedUploadUrl: jest.fn().mockResolvedValue({
          data: { signedUrl: "https://mocked.supabase/upload" },
          error: null,
        }),
        remove: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      }),
    },
  }),
}));

let prisma: PrismaClient | undefined;
let app: Express;
let stopDatabase: (() => Promise<void>) | undefined;

const user = { id: "user-1", email: "test@example.com" };
const JWT_SECRET = process.env.JWT_SECRET || "test-secret";
const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });

beforeAll(async () => {
  const { url, stop } = await startTestDatabase();
  stopDatabase = stop;

  process.env.DATABASE_URL = url;

  execSync("npx prisma migrate deploy", {
    env: { ...process.env },
    stdio: "inherit",
  });

  const appModule = await import("../index");
  app = appModule.default;

  prisma = new PrismaClient();

  await prisma.user.create({
    data: {
      id: user.id,
      email: user.email,
      password: "fake-password",
    },
  });
});

afterAll(async () => {
  if (prisma) await prisma.$disconnect();
  if (stopDatabase) await stopDatabase();
});

beforeEach(async () => {
  if (prisma) await prisma.song.deleteMany();
});

describe("Integration - /songs", () => {
  it("GET /songs returns empty array when no songs", async () => {
    const res = await request(app)
      .get("/songs")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("GET /songs returns list of songs", async () => {
    await prisma!.song.create({
      data: {
        name: "Hammer Smashed Face",
        artist: "Cannibal Corpse",
        imageUrl: "https://supabase-url/songs/corpse.png",
        user: { connect: { id: user.id } },
      },
    });

    const res = await request(app)
      .get("/songs")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Hammer Smashed Face");
  });

  it("POST /songs creates a new song", async () => {
    const res = await request(app)
      .post("/songs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "New Track",
        artist: "Test Artist",
        imageUrl: "https://supabase-url/songs/fake-image.png",
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("New Track");
    expect(res.body.artist).toBe("Test Artist");
  });

  it("POST /songs fails with missing fields", async () => {
    const res = await request(app)
      .post("/songs")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "", artist: "" }); // missing imageUrl

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it("POST /songs fails without auth token", async () => {
    const res = await request(app).post("/songs").send({
      name: "Track",
      artist: "Artist",
      imageUrl: "https://supabase-url/songs/image.png",
    });

    expect(res.status).toBe(401);
  });

  it("PUT /songs/:id updates an existing song", async () => {
    const song = await prisma!.song.create({
      data: {
        name: "Old Name",
        artist: "Old Artist",
        imageUrl: "https://supabase-url/songs/old-image.png",
        user: { connect: { id: user.id } },
      },
    });

    const res = await request(app)
      .put(`/songs/${song.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Name",
        artist: "Updated Artist",
        imageUrl: "https://supabase-url/songs/updated-image.png",
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Updated Name");
    expect(res.body.artist).toBe("Updated Artist");
  });

  it("PUT /songs/:id returns 404 if song not found", async () => {
    const fakeId = "a3f5b39e-4c52-4c95-9b36-3a827d129999";
    const res = await request(app)
      .put(`/songs/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated Name", artist: "Updated Artist" });

    expect(res.status).toBe(404);
    expect(res.body.errors).toContain("Song not found.");
  });

  it("DELETE /songs/:id deletes a song", async () => {
    const song = await prisma!.song.create({
      data: {
        name: "Delete Me",
        artist: "Artist",
        imageUrl: "https://supabase-url/songs/delete.png",
        user: { connect: { id: user.id } },
      },
    });

    const res = await request(app)
      .delete(`/songs/${song.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");

    const check = await prisma!.song.findUnique({ where: { id: song.id } });
    expect(check).toBeNull();
  });

  it("DELETE /songs/:id returns 404 if not found", async () => {
    const fakeId = "a3f5b39e-4c52-4c95-9b36-3a827d129999";
    const res = await request(app)
      .delete(`/songs/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.errors).toContain("Song not found.");
  });
});
