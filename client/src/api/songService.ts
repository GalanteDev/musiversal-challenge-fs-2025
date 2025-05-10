interface ApiError extends Error {
  response?: {
    data?: {
      status?: string;
      errors?: string[];
    };
  };
}

export async function getAllSongs() {
  try {
    const response = await fetch("/songs");

    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error("Failed to fetch songs") as ApiError;
      error.response = { data: errorData };
      throw error;
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching songs:", error.message);
    } else {
      console.error("Unknown error fetching songs");
    }
    throw error;
  }
}

export async function addSong(formData: FormData) {
  try {
    const response = await fetch("/songs", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error("Failed to add song") as ApiError;
      error.response = { data: errorData };
      throw error;
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error adding song:", error.message);
    } else {
      console.error("Unknown error adding song");
    }
    throw error;
  }
}

export async function deleteSong(id: string) {
  try {
    const response = await fetch(`/songs/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error("Failed to delete song") as ApiError;
      error.response = { data: errorData };
      throw error;
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting song:", error.message);
    } else {
      console.error("Unknown error deleting song");
    }
    throw error;
  }
}
