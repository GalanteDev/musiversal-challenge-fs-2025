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
  { name: "Black Sabbath", artist: "Black Sabbath", file: "blacksabbath.png" },
  { name: "Freak on a Leash", artist: "Korn", file: "korn.png" },
  { name: "Pull the Plug", artist: "Death", file: "death.png" },
  { name: "Total Destruction", artist: "Destruction", file: "destruction.png" },
];

const DEMO_PASSWORD = process.env.DEMO_PASSWORD!;
const EMPTY_USER_EMAIL = "empty.user@gmail.com";
const FULL_USER_EMAIL = "demo.user@gmail.com";

async function createUserIfNotExists(email: string, password: string) {
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    console.log(`✅ User Created: ${user.email}`);
  }
  return user;
}

async function main() {
  const emptyUser = await createUserIfNotExists(
    EMPTY_USER_EMAIL,
    DEMO_PASSWORD
  );
  const fullUser = await createUserIfNotExists(FULL_USER_EMAIL, DEMO_PASSWORD);

  if (process.env.NODE_ENV !== "production") {
    const confirmed = await askConfirmation();
    if (!confirmed) return;

    await prisma.song.deleteMany({ where: { userId: fullUser.id } });
    console.log("✅ Deleted demo user's songs from DB");

    const { data: files } = await supabase.storage.from("songs").list();
    if (files && files.length > 0) {
      const filesToRemove = PROTECTED_SONGS.map((s) => s.file);
      const toRemove = files.filter((file) =>
        filesToRemove.includes(file.name)
      );
      if (toRemove.length > 0) {
        const names = toRemove.map((file) => file.name);
        await supabase.storage.from("songs").remove(names);
        console.log("✅ Removed demo user seed images from Supabase storage");
      }
    }
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
        userId: fullUser.id,
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
      "This will delete demo user's songs and images. Continue? (y/N): ",
      (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === "y");
      }
    );
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
