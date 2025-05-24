import request from "supertest";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import type { Express } from "express";
import { startTestDatabase } from "../test-utils/setup/postgres.testcontainer";

// ✅ Mock Supabase only for getSignedUploadUrl
jest.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        createSignedUploadUrl: jest.fn().mockResolvedValue({
          data: { signedUrl: "https://mocked.supabase/upload" },
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
  try {
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
        id: "user-1",
        email: user.email,
        password: "fake-password",
      },
    });
  } catch (err) {
    console.error("❌ Error in beforeAll:", err);
    throw err;
  }
});

afterAll(async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
  if (typeof stopDatabase === "function") {
    await stopDatabase();
  }
});

beforeEach(async () => {
  if (prisma) {
    await prisma.song.deleteMany();
  }
});

describe("Integration - /songs", () => {
  it("GET /songs should return empty array", async () => {
    const res = await request(app)
      .get("/songs")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("GET /songs should return list with existing song", async () => {
    await prisma!.song.create({
      data: {
        name: "Hammer Smashed Face",
        artist: "Cannibal Corpse",
        imageUrl: "corpse.png",
        user: { connect: { id: user.id } },
      },
    });

    const res = await request(app)
      .get("/songs")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe("Hammer Smashed Face");
  });

  it("POST /songs should create a new song", async () => {
    const res = await request(app)
      .post("/songs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "New Track",
        artist: "Test Artist",
        imageUrl: "fake-image.png",
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("New Track");
    expect(res.body.artist).toBe("Test Artist");
    expect(res.body.imageUrl).toBe("fake-image.png");
  });

  it("POST /songs should fail if required fields are missing", async () => {
    const res = await request(app)
      .post("/songs")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "", artist: "" }); // imageUrl missing

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it("POST /songs should fail without token", async () => {
    const res = await request(app).post("/songs").send({
      name: "Track",
      artist: "Artist",
      imageUrl: "image.png",
    });

    expect(res.status).toBe(401);
  });

  it("PUT /songs/:id should update an existing song", async () => {
    const song = await prisma!.song.create({
      data: {
        name: "Old Name",
        artist: "Old Artist",
        imageUrl: "old-image.png",
        user: { connect: { id: user.id } },
      },
    });

    const res = await request(app)
      .put(`/songs/${song.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Name",
        artist: "Updated Artist",
        imageUrl: "updated-image.png",
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Updated Name");
    expect(res.body.artist).toBe("Updated Artist");
    expect(res.body.imageUrl).toBe("updated-image.png");
  });

  it("PUT /songs/:id should return 404 if song not found", async () => {
    const fakeId = "a3f5b39e-4c52-4c95-9b36-3a827d129999";
    const res = await request(app)
      .put(`/songs/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated Name", artist: "Updated Artist" });

    expect(res.status).toBe(404);
    expect(res.body.errors).toContain("Song not found.");
  });

  it("DELETE /songs/:id should delete a song", async () => {
    const song = await prisma!.song.create({
      data: {
        name: "Delete Me",
        artist: "Artist",
        imageUrl: "delete.png",
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

  it("DELETE /songs/:id should return 404 if not found", async () => {
    const fakeId = "a3f5b39e-4c52-4c95-9b36-3a827d129999";
    const res = await request(app)
      .delete(`/songs/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.errors).toContain("Song not found.");
  });
});
