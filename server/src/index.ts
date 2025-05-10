import express from "express";
import cors from "cors";
import path from "path";
import songRoutes from "./routes/song.routes";
import { songService } from "./services/song.service";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
songService.create(
  "Hammer Smashed Face",
  "Cannibal Corpse",
  "canibalcorpse.png"
);
songService.create("Roots Bloody Roots", "Sepultura", "sepultura.png");
songService.create("Raining Blood", "Slayer", "slayer.png");

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/songs", songRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
