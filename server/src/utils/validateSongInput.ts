export interface SongValidationInput {
  name: unknown;
  artist: unknown;
  file: { filename: string } | null;
}

export function validateSongInput(input: SongValidationInput): string[] {
  const errors: string[] = [];

  if (
    !input.name ||
    typeof input.name !== "string" ||
    input.name.trim().length === 0
  ) {
    errors.push("Name is required.");
  } else if (input.name.trim().length > 100) {
    errors.push("Name must be at most 100 characters.");
  }

  if (
    !input.artist ||
    typeof input.artist !== "string" ||
    input.artist.trim().length === 0
  ) {
    errors.push("Artist is required.");
  } else if (input.artist.trim().length > 100) {
    errors.push("Artist must be at most 100 characters.");
  }

  if (!input.file) {
    errors.push("Album cover image is required.");
  }

  return errors;
}
