import type { Song } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function fetchSongs(): Promise<Song[]> {
  try {
    const response = await fetch(`${API_URL}/songs`);

    if (!response.ok) {
      throw new Error(`Error fetching songs: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching songs:", error);
    throw new Error(
      "Failed to fetch songs. Please check your connection and try again."
    );
  }
}

export async function createSong(formData: FormData): Promise<Song> {
  try {
    const response = await fetch(`${API_URL}/songs`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error creating song: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error creating song:", error);
    throw new Error("Failed to create song. Please try again.");
  }
}

export async function updateSong(
  id: string,
  formData: FormData
): Promise<Song> {
  try {
    const response = await fetch(`${API_URL}/songs/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error updating song: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error updating song:", error);
    throw new Error("Failed to update song. Please try again.");
  }
}

export async function deleteSong(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/songs/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error deleting song: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting song:", error);
    throw new Error("Failed to delete song. Please try again.");
  }
}
