// API service for interacting with the song endpoints

export interface Song {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
}

// Get all songs
export async function getAllSongs(): Promise<Song[]> {
  try {
    const response = await fetch("/songs");
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    console.log("Response:", response);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch songs:", error);
    throw error;
  }
}

// Add a new song
export async function addSong(formData: FormData): Promise<Song> {
  try {
    const response = await fetch("/songs", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to add song:", error);
    throw error;
  }
}

// Delete a song
export async function deleteSong(id: string): Promise<void> {
  try {
    const response = await fetch(`/songs/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error(`Failed to delete song with ID ${id}:`, error);
    throw error;
  }
}
