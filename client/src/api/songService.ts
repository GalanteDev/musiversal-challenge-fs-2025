import type { Song } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

async function parseErrorResponse(res: Response): Promise<never> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let payload: any;
  try {
    payload = await res.json();
  } catch {
    throw new Error(res.statusText || `Error ${res.status}`);
  }

  if (Array.isArray(payload.errors) && payload.errors.length > 0) {
    throw new Error(payload.errors[0]);
  }
  if (typeof payload.error === "string") {
    throw new Error(payload.error);
  }
  if (typeof payload.message === "string") {
    throw new Error(payload.message);
  }

  throw new Error(res.statusText || `Error ${res.status}`);
}

export async function getAllSongs(): Promise<Song[]> {
  const res = await fetch(`${API_URL}/songs`);
  if (!res.ok) await parseErrorResponse(res);
  return res.json();
}

export async function addSong(formData: FormData): Promise<Song> {
  const res = await fetch(`${API_URL}/songs`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) await parseErrorResponse(res);
  return res.json();
}

export async function deleteSong(
  id: string
): Promise<{ status: string; message: string }> {
  const res = await fetch(`${API_URL}/songs/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) await parseErrorResponse(res);
  return res.json();
}
