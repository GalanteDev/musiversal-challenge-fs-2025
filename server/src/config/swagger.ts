// src/config/swagger.ts
import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Musiversal Songs API",
      version: "1.0.0",
      description:
        "API for uploading, updating and managing songs with cover images.",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
    components: {
      schemas: {
        Song: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "d87c9fa3-420b-4f88-9525-1db381ab1187",
            },
            name: {
              type: "string",
              example: "Raining Blood",
            },
            artist: {
              type: "string",
              example: "Slayer",
            },
            imageUrl: {
              type: "string",
              example: "/uploads/slayer.png",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/song.routes.ts"],
});
