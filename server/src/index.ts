import express from "express";
import cors from "cors";
import "dotenv/config";
import songRoutes from "./routes/song.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from "./routes/auth.routes";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/songs", songRoutes);

app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

export default app;
