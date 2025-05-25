export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Musiversal Songs API",
    version: "1.0.0",
    description:
      "API for managing a song library with JWT authentication and image uploads to Supabase Storage.",
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
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT token using Bearer authentication scheme",
      },
    },
    schemas: {
      Song: {
        type: "object",
        required: ["id", "name", "artist", "imageUrl", "userId"],
        properties: {
          id: { type: "string", format: "uuid", example: "uuid-v4-id" },
          name: { type: "string", example: "Raining Blood" },
          artist: { type: "string", example: "Slayer" },
          imageUrl: { type: "string", example: "/uploads/slayer.png" },
          userId: { type: "string", format: "uuid", example: "uuid-v4-user" },
        },
      },
      User: {
        type: "object",
        required: ["id", "email"],
        properties: {
          id: { type: "string", format: "uuid", example: "uuid-v4-user" },
          email: {
            type: "string",
            format: "email",
            example: "user@example.com",
          },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "user@example.com",
          },
          password: {
            type: "string",
            format: "password",
            example: "secret123",
          },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          token: { type: "string", description: "JWT token" },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      UploadUrlResponse: {
        type: "object",
        properties: {
          fileName: { type: "string", example: "random-uuid.jpg" },
          uploadUrl: { type: "string", format: "uri" },
          publicUrl: { type: "string", format: "uri" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "error" },
          errors: {
            type: "array",
            items: { type: "string" },
            example: ["Invalid credentials"],
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
  security: [{ bearerAuth: [] }],
  paths: {
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login and obtain JWT token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Successful login",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" },
              },
            },
          },
          401: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: { status: "error", errors: ["Invalid credentials"] },
              },
            },
          },
        },
      },
    },

    "/songs": {
      get: {
        tags: ["Songs"],
        summary: "Retrieve all songs for the authenticated user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of user songs",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Song" },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Songs"],
        summary: "Create a new song",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "artist", "imageUrl"],
                properties: {
                  name: { type: "string", example: "Raining Blood" },
                  artist: { type: "string", example: "Slayer" },
                  imageUrl: {
                    type: "string",
                    example: "/uploads/slayer.png",
                    description: "Cover image URL",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Song created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Song" },
              },
            },
          },
          400: {
            description: "Invalid input",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/songs/{id}": {
      put: {
        tags: ["Songs"],
        summary: "Update a song by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Song ID (UUID)",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Raining Blood" },
                  artist: { type: "string", example: "Slayer" },
                  imageUrl: {
                    type: "string",
                    example: "/uploads/slayer-new.png",
                    description: "Cover image URL",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Song updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Song" },
              },
            },
          },
          400: {
            description: "Invalid input",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          403: {
            description: "Forbidden - Not the owner",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: {
                  status: "error",
                  errors: ["You are not authorized to update this song."],
                },
              },
            },
          },
          404: {
            description: "Song not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Songs"],
        summary: "Delete a song by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "Song ID (UUID)",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: {
            description: "Song deleted",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessResponse" },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          403: {
            description: "Forbidden - Not the owner",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: {
                  status: "error",
                  errors: ["You are not authorized to delete this song."],
                },
              },
            },
          },
          404: {
            description: "Song not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/songs/upload-url": {
      post: {
        tags: ["Songs"],
        summary: "Get signed upload URL for song cover image",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["fileType"],
                properties: {
                  fileType: {
                    type: "string",
                    example: "image/jpeg",
                    description: "MIME type of the image file",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Signed upload URL",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UploadUrlResponse" },
              },
            },
          },
          400: {
            description: "Invalid or unsupported file type",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
};
