import express from "express";
import cors from "cors";
import path from "path";
import "dotenv/config";
import songRoutes from "./routes/song.routes";
import { preloadProtectedImages } from "./utils/preloadedProtectedImages";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { errorHandler } from "./middleware/error.middleware";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

app.use(cors());
app.use(express.json());

// 👇 Handle images and protected songs.
preloadProtectedImages();

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/songs", songRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
