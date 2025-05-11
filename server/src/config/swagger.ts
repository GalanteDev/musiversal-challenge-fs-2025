// src/config/swagger.ts
import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Musiversal Songs API",
      version: "1.0.0",
      description:
        "API for managing a songs library, with protected seeding and upload support",
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Local development server",
      },
      {
        url: "https://your-production-url.com",
        description: "Production server",
      },
    ],
    components: {
      schemas: {
        Song: {
          type: "object",
          properties: {
            id: { type: "string", example: "uuid-v4-id" },
            name: { type: "string", example: "Raining Blood" },
            artist: { type: "string", example: "Slayer" },
            imageUrl: { type: "string", example: "/uploads/slayer.png" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "error" },
            errors: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            message: { type: "string", example: "Song deleted." },
          },
        },
      },
    },
  },
  apis: ["./src/controllers/*.ts", "./src/dtos/*.ts"],
});
