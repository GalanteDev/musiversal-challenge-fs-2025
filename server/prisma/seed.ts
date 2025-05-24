import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PROTECTED_SONGS = [
  {
    name: "Hammer Smashed Face",
    artist: "Cannibal Corpse",
    file: "canibalcorpse.png",
  },
  { name: "Roots Bloody Roots", artist: "Sepultura", file: "sepultura.png" },
  { name: "Raining Blood", artist: "Slayer", file: "slayer.png" },
];

const DEMO_EMAIL = "galante.julian@gmail.com";
const plainPassword = process.env.DEMO_PASSWORD!;

async function main() {
  if (process.env.NODE_ENV !== "production") {
    const confirmed = await askConfirmation();
    if (!confirmed) return;
    await prisma.song.deleteMany();
    const { data: files, error } = await supabase.storage.from("songs").list();
    if (files) {
      const names = files.map((file) => file.name);
      await supabase.storage.from("songs").remove(names);
      console.log("✅ Seed images removed from Supabase storage");
    }
  }

  let user = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });

  if (!user) {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    user = await prisma.user.create({
      data: {
        email: DEMO_EMAIL,
        password: hashedPassword,
      },
    });
    console.log(`✅ User Created: ${user.email}`);
  }

  for (const song of PROTECTED_SONGS) {
    const filePath = path.join(__dirname, "images", song.file);
    const fileBuffer = fs.readFileSync(filePath);

    const { error: uploadError } = await supabase.storage
      .from("songs")
      .upload(song.file, fileBuffer, {
        contentType: "image/png",
        upsert: false,
      });

    if (uploadError) {
      console.error(`❌ Error uploading ${song.file}:`, uploadError.message);
      continue;
    }

    await prisma.song.create({
      data: {
        name: song.name,
        artist: song.artist,
        imageUrl: `/storage/v1/object/public/songs/${song.file}`,
        user: { connect: { id: user.id } },
      },
    });

    console.log(`🎵 Song seeded: ${song.name}`);
  }
}

import readline from "readline";

function askConfirmation(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(
      "This will delete all songs and images. Continue? (y/N): ",
      (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === "y");
      }
    );
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
