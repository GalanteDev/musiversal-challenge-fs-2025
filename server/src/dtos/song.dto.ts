import { z } from "zod";

export const createSongSchema = z.object({
  name: z.string().min(1, "Name is required"),
  artist: z.string().min(1, "Artist is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
});
export type CreateSongDto = z.infer<typeof createSongSchema>;

export const updateSongSchema = z
  .object({
    name: z.string().min(1).optional(),
    artist: z.string().min(1).optional(),
    imageUrl: z.string().min(1).optional(),
  })
  .refine((data) => data.name || data.artist || data.imageUrl, {
    message: "At least one field (name, artist, or imageUrl) is required",
  });

export type UpdateSongDto = z.infer<typeof updateSongSchema>;
