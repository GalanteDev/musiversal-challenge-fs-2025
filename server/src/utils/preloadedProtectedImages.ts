// src/utils/preloadProtectedImages.ts

import fs from "fs";
import path from "path";
import { songService } from "../services/song.service";

// Lista de canciones protegidas
const protectedSongs = [
  {
    name: "Hammer Smashed Face",
    artist: "Cannibal Corpse",
    file: "canibalcorpse.png",
  },
  {
    name: "Roots Bloody Roots",
    artist: "Sepultura",
    file: "sepultura.png",
  },
  {
    name: "Raining Blood",
    artist: "Slayer",
    file: "slayer.png",
  },
];

export function preloadProtectedImages() {
  const sourceDir = path.join(__dirname, "../../static-images");
  const uploadDir = path.join(__dirname, "../../uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  for (const { name, artist, file } of protectedSongs) {
    const src = path.join(sourceDir, file);
    const dest = path.join(uploadDir, file);

    if (!fs.existsSync(src)) {
      console.warn(`⚠️ Missing protected image in static-images/: ${file}`);
      continue;
    }

    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
      console.log(`✅ Copied protected image: ${file}`);
    }

    // Verificar si ya está cargada la canción
    const alreadyExists = songService
      .getAll()
      .some(
        (s) =>
          s.name.toLowerCase() === name.toLowerCase() &&
          s.artist.toLowerCase() === artist.toLowerCase()
      );

    if (!alreadyExists) {
      songService.create(name, artist, file);
      console.log(`🎵 Restored protected song: "${name}" by ${artist}`);
    }
  }
}
