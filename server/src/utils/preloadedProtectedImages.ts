import fsPromises from "fs/promises";
import path from "path";
import { songService } from "../services/song.service";
import { PROTECTED_SONGS, UPLOAD_DIR } from "../config";

/**
 * Ensures protected songs are seeded and cleans up any non-protected files.
 */
export async function preloadProtectedImages(): Promise<void> {
  const sourceDir = path.resolve(__dirname, "../../static-images");

  // 1) Ensure uploads directory exists
  try {
    await fsPromises.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (err) {
    console.error("❌ Cannot create upload directory:", UPLOAD_DIR, err);
    throw err;
  }

  // 2) Cleanup: remove any files not in protectedSongs
  try {
    const existingFiles = await fsPromises.readdir(UPLOAD_DIR);
    await Promise.all(
      existingFiles
        .filter((f) => !PROTECTED_SONGS.some((ps) => ps.file === f))
        .map((f) => fsPromises.unlink(path.join(UPLOAD_DIR, f)))
    );
    console.log("🧹 Cleaned up non-protected files in uploads directory.");
  } catch (err) {
    console.error("❌ Failed to cleanup uploads directory:", err);
  }

  // 3) Seed protected images and songs
  for (const { name, artist, file } of PROTECTED_SONGS) {
    const srcPath = path.join(sourceDir, file);
    const destPath = path.join(UPLOAD_DIR, file);

    // Check source exists
    if (!(await fsPromises.stat(srcPath).catch(() => false))) {
      console.warn(`⚠️ Missing protected image in static-images/: ${file}`);
      continue;
    }

    // Copy file if not already in uploads
    if (!(await fsPromises.stat(destPath).catch(() => false))) {
      try {
        await fsPromises.copyFile(srcPath, destPath);
        console.log(`✅ Copied protected image: ${file}`);
      } catch (err) {
        console.error(`❌ Failed copying ${file} to uploads:`, err);
        continue;
      }
    }

    // Register song if not already in memory (case-insensitive)
    const exists = (await songService.getAll()).some(
      (s) =>
        s.name.trim().toLowerCase() === name.toLowerCase() &&
        s.artist.trim().toLowerCase() === artist.toLowerCase()
    );

    if (!exists) {
      try {
        songService.create(name, artist, file);
        console.log(`🎵 Restored protected song: "${name}" by ${artist}`);
      } catch (err) {
        console.error(`❌ Failed to create protected song "${name}":`, err);
      }
    }
  }
}
