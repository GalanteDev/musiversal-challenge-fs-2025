export function getExtensionFromMimeType(mimeType: string): string | null {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/jpg": "jpg",
  };
  return map[mimeType] || null;
}
