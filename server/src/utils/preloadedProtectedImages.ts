// src/utils/preloadProtectedImages.ts

import fs from "fs";
import path from "path";

export function preloadProtectedImages() {
  const sourceDir = path.join(__dirname, "../../static-images");
  const uploadDir = path.join(__dirname, "../../uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const protectedImages = ["sepultura.png", "slayer.png", "canibalcorpse.png"];

  for (const file of protectedImages) {
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
  }
}
