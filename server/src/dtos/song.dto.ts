import { z } from "zod";

export const createSongSchema = z.object({
  name: z.string().min(1, "Name is required"),
  artist: z.string().min(1, "Artist is required"),
});
export type CreateSongDto = z.infer<typeof createSongSchema>;

export const updateSongSchema = z.object({
  name: z.string().min(1, "Name is required"),
  artist: z.string().min(1, "Artist is required"),
});
export type UpdateSongDto = z.infer<typeof updateSongSchema>;
